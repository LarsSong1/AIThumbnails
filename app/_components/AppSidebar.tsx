import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Image as ImageIcon, Key, Lightbulb, Plug, ScanSearch, Search, Settings, SmartphoneCharging } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignOutButton, UserButton } from '@clerk/nextjs'

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Thumbnail Generator",
        url: "/ThumbnailGenerator",
        icon: ImageIcon,
    },
    {
        title: "Thumbnail Search",
        url: "/ThumbnailSearch",
        icon: ScanSearch,
    },
    {
        title: "Keywords",
        url: "/TrendingKeywords",
        icon: Key,
    },
    {
        title: 'Outlier',
        url: "/outlier",
        icon: SmartphoneCharging,
    },
    {
        title: 'AI Content Generator',
        url: '/ContentGenerator',
        icon: Lightbulb,
    },
    // {
    //     title: "Billing",
    //     url: "#",
    //     icon: Settings,
    // },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar className=''>
            <SidebarHeader className='bg-black'>
                <div className='p-4 flex flex-col justify-center items-start'>
                    <Image src={'./AIToolsLogo.svg'} alt='logo' width={20} height={20}
                        className='w-[100px] h-auto' />
                    <h2 className='text-sm text-gray-400 text-start'>AI Generation Tools</h2>
                </div>
            </SidebarHeader>
            <SidebarContent className='bg-black'>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-md flex gap-2 items-center
                                 hover:bg-green-600 text-white hover:text-black  ${path.includes(item.url) && 'bg-gray-200ß'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='bg-black'>
                <div className='p-2'>
                    <UserButton/>
                </div>
                <h2 className='p-2 text-gray-400 text-xs'>Copyright @Jair Gavilanez @Damaris Zambrano</h2>
            </SidebarFooter>
        </Sidebar>
    )
}