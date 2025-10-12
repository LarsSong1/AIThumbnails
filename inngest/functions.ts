import { AiContentTable, AiThumbnailTable, TrendingKeywordsTable } from "@/configs/schema";
import { inngest } from "./client";
import ImageKit from "imagekit";
import OpenAI from 'openai';
import Replicate from "replicate";
import { db } from "@/configs/db";
import dayjs from 'dayjs'
import axios from "axios";
import { chromium } from 'playwright'
import { VideoSearchResult } from "@/types/ThumbnailSearch";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);



export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,

});


export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY
})

//@ts-ignore
const imageKit = new ImageKit({
  //@ts-ignore
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  //@ts-ignore
  urlEndpoint: process.env.IMAGEKIT_URLENDPOINT,
})


export const GenerateAiThumbnail = inngest.createFunction(
  { id: 'ai/generate-thumbnail' },
  { event: 'ai/generate-thumbnail' },
  async ({ event, step }) => {
    const { userEmail, refImage, faceImage, userInput } = event.data;
    // await step.sleep("wait-a-moment", "3s");
    // return 'Success'


    // Upload image to ImageKit
    const uploadImageUrls = await step.run("UploadImage", async () => {
      console.log("Inngest received data:", {
        hasRefImage: !!refImage,
        hasFaceImage: !!faceImage,
        faceImageType: faceImage?.type,
        faceImageName: faceImage?.name,
        faceImageBufferSample: faceImage?.buffer?.substring(0, 30)
      });

      let refImageUrl: string | null = null;
      if (refImage) {
        const uploadRef = await imageKit.upload({
          file: `data:${refImage.type};base64,${refImage.buffer}`,
          fileName: refImage.name,
          isPublished: true,
          useUniqueFileName: false,
        });
        refImageUrl = uploadRef.url;
      }

      let faceImageUrl: string | null = null;
      if (faceImage) {
        const uploadFace = await imageKit.upload({
          file: `data:${faceImage.type};base64,${faceImage.buffer}`,
          fileName: faceImage.name,
          isPublished: true,
          useUniqueFileName: false,
        });
        faceImageUrl = uploadFace.url;
      }

      return { refImageUrl, faceImageUrl };
    });


    // Generate AI Prompt from AI Model

    // const generateThumbnailPrompt = await step.run('generateThumbnailPrompt', async () => {
    //   const completion = await openai.chat.completions.create({
    //     model: 'google/gemini-2.0-flash-exp:free',
    //     messages: [
    //       {
    //         "role": "user",
    //         "content": [
    //           {
    //             "type": "text",
    //             "text": uploadImageUrls ? `Con respecto a este thumbnail url escribe un prompt para generar un thumbnail para youtube similar o que cuente con las caracteristicas de la imagen adjunta y que incluya todo lo que contiene:` + userInput + `Solo dame el texto del prompt, no otro comentario` :
    //               `Dependiendo de la imagen que se te enviara, escribe un prompt para generar un thumbnail para youtube similar o que cuente con las caracteristicas de la imagen adjunta y que incluya todo lo que contiene: ${userInput} Solo dame el texto del promot, no otro comentario`,
    //           },
    //           //@ts-ignore
    //           ...(uploadImageUrls
    //             ? [
    //               {
    //                 "type": "image_url",
    //                 "image_url": {
    //                   "url": uploadImageUrls.refImageUrl ?? '',
    //                 }
    //               }
    //             ]
    //             : [])
    //         ]
    //       }
    //     ],
    //   });
    //   console.log(completion.choices[0].message.content);
    //   return completion.choices[0].message.content;
    // })


    // Generate AI Prompt from AI Model
    const generateThumbnailPrompt = await step.run('generateThumbnailPrompt', async () => {
      const maxRetries = 3;
      let lastError;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'mistralai/mistral-small-3.2-24b-instruct:free',
            messages: [
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": uploadImageUrls.refImageUrl
                      ? `Con respecto a este thumbnail, escribe un prompt para generar un thumbnail para YouTube similar o que cuente con las características de la imagen adjunta: ${userInput}. Solo dame el texto del prompt, no otro comentario.`
                      : `Escribe un prompt para generar un thumbnail para YouTube basado en: ${userInput}. Solo dame el texto del prompt, no otro comentario.`,
                  },
                  //@ts-ignore
                  ...(uploadImageUrls.refImageUrl
                    ? [
                      {
                        "type": "image_url",
                        "image_url": {
                          "url": uploadImageUrls.refImageUrl,
                        }
                      }
                    ]
                    : [])
                ]
              }
            ],
          });

          console.log(completion.choices[0].message.content);
          return completion.choices[0].message.content;

        } catch (error: any) {
          lastError = error;

          if (error.status === 429 && attempt < maxRetries - 1) {
            // Exponential backoff: 2^attempt seconds
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }
      }

      throw lastError;
    });

    // Generate AI Image
    const generateThumbnailImage = await step.run(
      'Generate Image', async () => {
        const input = {
          prompt: generateThumbnailPrompt,
          aspect_ratio: "16:9",
          output_format: "jpg",
          safety_filter_level: "block_only_high"
        };
        const output = await replicate.run("google/imagen-4-fast", { input });

        //@ts-ignore
        return output.url()

      }
    )

    // Save Image to Cloud
    const uploadThumbnail = await step.run(
      'Upload Thumbnail',
      async () => {

        if (!generateThumbnailImage) {
          throw new Error("No image generated to upload");
        }

        const timestamp = Date.now();
        const uniqueFileName = `thumbnail_${timestamp}.png`;

        const imageRef = await imageKit.upload({
          file: generateThumbnailImage,
          fileName: uniqueFileName,
          isPublished: true,
          useUniqueFileName: false
        })

        return imageRef.url
      }

    )



    // Save record to Database
    const SaveToDB = await step.run(
      'SaveToDb',
      async () => {
        const result = await db.insert(AiThumbnailTable).values({
          userInput: userInput,
          thumbnailUrl: uploadThumbnail,
          createdOn: dayjs().format('YYYY-MM-DD'),
          refImage: uploadImageUrls.refImageUrl,
          userEmail: userEmail
          //@ts-ignore
        }).returning(AiThumbnailTable)

        return result
      }
    )

    return SaveToDB;
  }
)

// const PromptForContentGenerator = `
// Eres un experto del enganche de videos en Youtube, SEO, estratega y un asistente de contenido creativo.
// -Dame cuatro titulos de videos optimizados para SEO
// -Dame el SEO Score de cada titulo (1 al 100)
// -Dame una descripcion corta que complemente el tema seleccionado 
// -Dame 10 tags relevantes que complemente el tema seleccionado
// -Dame dos diferentes prompts de miniaturas para generar miniaturas profesionales

// UserInput: {{user_input}}

// -Retorna el resultado en formato JSON (JSON only y manten los nombres de las claves):
// json
// Copy
// Edit
// {
//   "titles": [
//   {
//   "title": "Title 1",
//   "seo_score": 87
//   },
//   {
//   "title": "Title 2",
//   "seo_score": 82
//   }
//  ],
//  "description":  "Escribe una profesional y enganchadora descripcion para videos de youtube basados en el input",
//  "tags": [
//   "Tag 1",
//   "Tag 2"
//  ],
//  "prompts": [
//  "Prompt 1",
//  "Prompt 2"
//  ]
// }

// `
const PromptForContentGenerator = `
Eres un experto en engagement de videos de Youtube, SEO y estratega de contenido creativo.

Genera contenido optimizado basado en el siguiente input del usuario:
- CUATRO títulos de videos optimizados para SEO con sus scores individuales (1-100)
- UNA descripción profesional y enganchadora (150-200 caracteres)
- 10 tags relevantes y específicos
- DOS prompts diferentes para generar miniaturas profesionales y llamativas

UserInput: {{user_input}}

IMPORTANTE: Retorna SOLO el JSON sin texto adicional, manten las claves en ingles, no le cambies nada al formato json, sin markdown, sin explicaciones.

Formato JSON requerido:
{
  "titles": [
    {
      "title": "Título optimizado 1",
      "seo_score": 87
    },
    {
      "title": "Título optimizado 2",
      "seo_score": 82
    },
    {
      "title": "Título optimizado 3",
      "seo_score": 79
    },
    {
      "title": "Título optimizado 4",
      "seo_score": 75
    }
  ],
  "description": "Descripción profesional y enganchadora que complemente el tema y genere curiosidad",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "prompts": [
    "Miniatura profesional estilo YouTube: [descripción detallada del diseño visual]",
    "Miniatura impactante estilo viral: [descripción detallada alternativa]"
  ]
}

`;



export const GenerateAiContent = inngest.createFunction(
  { id: 'ai/generate-content' },
  { event: 'ai/generate-content' },
  async ({ event, step }) => {
    const { userInput, userEmail } = event.data;

    // TO GENERATE, TITLE, DESCRIPTION, TAGS AND THUMBNAIL PROMPT
    const generateContent = await step.run('GenerateAiContent', async () => {
      const maxRetries = 3;
      let lastError;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'mistralai/mistral-small-3.2-24b-instruct:free',
            messages: [
              {
                "role": "user",
                "content": PromptForContentGenerator.replace('{{user_input}}', userInput)
              }
            ],
          });
          const RawJson = completion.choices[0].message.content
          const formattedString = RawJson?.replace('```json', '').trim().replace('```', '').trim();
          const formattedJson = formattedString && JSON.parse(formattedString);
          return formattedJson



        } catch (error: any) {
          lastError = error;

          if (error.status === 429 && attempt < maxRetries - 1) {
            // Exponential backoff: 2^attempt seconds
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }
      }

      throw lastError;
    });

    // TO GENERATE THUMBNAIL PROMPT
    const generateThumbnailImage = await step.run(
      'Generate Image', async () => {
        const input = {
          prompt: generateContent?.prompts[0],
          aspect_ratio: "16:9",
          output_format: "jpg",
          safety_filter_level: "block_only_high"
        };
        const output = await replicate.run("google/imagen-4-fast", { input });

        //@ts-ignore
        return output.url()

      }
    )

    // Save Image to Cloud
    const uploadThumbnail = await step.run(
      'Upload Thumbnail',
      async () => {

        if (!generateThumbnailImage) {
          throw new Error("No image generated to upload");
        }

        const timestamp = Date.now();
        const uniqueFileName = `thumbnail_${timestamp}.png`;

        const imageRef = await imageKit.upload({
          file: generateThumbnailImage,
          fileName: uniqueFileName,
          isPublished: true,
          useUniqueFileName: false
        })

        return imageRef.url
      }

    )


    // SAVE TO DB
    const SaveToDB = await step.run('SaveToDB', async () => {
      const result = await db.insert(AiContentTable).values({
        content: generateContent,
        createdOn: dayjs().format('YYYY-MM-DD'),
        thumbnailUrl: uploadThumbnail,
        userEmail: userEmail,
        userInput: userInput
        //@ts-ignore
      }).returning(AiContentTable)
      return result
    })

    return SaveToDB
    // return generateContent
  },
)



export const GetTrendingKeywords = inngest.createFunction(
  { id: 'ai/trending-keywords' },
  { event: 'ai/trending-keywords' },
  async ({ event, step }) => {
    const { userInput, userEmail } = event.data;

    const GoogleSearchResult = await step.run(
      'GoogleSearchResults',
      async () => {
        const { data } = await axios.get('https://api.hasdata.com/scrape/google/serp', {
          params: {
            // q: userInput?.replaceAll(' ', ''),
            q: userInput,
            tbm: 'vid', // ✅ Filtro de videos (esto es clave)
            location: 'United States',
            deviceType: 'desktop',
            num: 20 // Número de resultados (opcional)
          },
          headers: {
            'x-api-key': process.env.HASDATA_API_KEY, // ✅ Cambia por tu variable de entorno
            'Content-Type': 'application/json'
          }
        });

        const response = data;

        let titles:any = []
        response?.organicResults.forEach((item: any) => {
          titles.push(item.title)
        })

        return titles


      }
    );


    // GET YOUTUBE SEARCH RESULTS USING YOUTUBE API
    const YoutubeResult = await step.run('Youtube Result', async () => {
      const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${userInput}&type=video&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`);
      const searchData = result.data;

      let titles: any = []
      searchData.items.forEach((item: any) => {
        titles.push(item.snippet.title)
      })

      return titles

    })


    // AI MODEL TO GENERATE KEYWORDS

    const KeyWordsList = await step.run('generateKeywords', async () => {
      const PromptForKeyWords = `
      You are a JSON API. You must respond ONLY with valid JSON, no explanations or markdown.
      Given the user input {{userInput}} and a list of YouTube video titles, extract high-ranking SEO-relevant keywords.
      For each keyword:
      * Assign an SEO score (1-100) based on search potential and relevance.
      * Include a few related queries or search phrases (based on user intent or variations from the      video titles).
      Return the result in this JSON format:

      {
      "main_keyword": "NextJs AI Projects",
      "keywords": [
          {
          "keyword": "Your Extracted Keyword",
          "score": NumericScore,
          "related_queries": [
              "related query 1",
              "related query 2"
          ]
          },
          ...
      ]
      }

      [✅] Use the titles below to extract SEO keywords and generate related search phrases:
      {{titles}}
      [✅] Only include keywords relevant to Next.js AI projects. Keep keywords concise, focused, and relevant.`
      const completion = await openai.chat.completions.create({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [
          {
            "role": "user",
            "content": PromptForKeyWords.replace('{{userInput}}', userInput).replace('{{titles}}', JSON.stringify(GoogleSearchResult)+JSON.stringify(YoutubeResult))
          }
        ],
      });
      const RawJson = completion.choices[0].message.content
      const formattedString = RawJson?.replace('```json', '').trim().replace('```', '').trim();
      const formattedJson = formattedString && JSON.parse(formattedString);
      return formattedJson
    })

    // SAVE TO DB
    const SaveToDb = await step.run('SaveToDb', async () => {
      const result = await db.insert(TrendingKeywordsTable).values({
        keywordsData: KeyWordsList,
        userEmail: userEmail,
        createdOn: dayjs().format('YYYY-MM-DD'),
        userInput: userInput
        //@ts-ignore
      }).returning(TrendingKeywordsTable)
      return result
    })
    
    return SaveToDb
  }
);
