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
    {
        title: "Billing",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <Image src={'./logo.svg'} alt='logo' width={100} height={100}
                        className='w-full h-full' />
                    <h2 className='text-sm text-gray-400 text-center'>Build Awesome</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200ß'}`}>
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
            <SidebarFooter>
                <h2 className='p-2 text-gray-400 text-xs'>Copyright @Jair Gavilanez @Damaris Zambrano</h2>
            </SidebarFooter>
        </Sidebar>
    )
}