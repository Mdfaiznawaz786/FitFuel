"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SearchCheck,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import API from "@/utils/api"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Add state for user data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "/avatars/default-avatar.jpg", // Default avatar
  });

  // Static parts of the data
  const teamsData = [
    {
      name: "Consistency",
      logo: GalleryVerticalEnd,
      plan: "Get Your Diet",
    }
  ];

  const navMainData = [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/profile",
        },
        {
          title: "Progress",
          url: "/progress",
        }
      ],
    },
    {
      title: "Generate Diet Plan",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Diet Plan",
          url: "/createDiet",
        },
      ],
    },
    {
      title: "History",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Medical History",
          url: "/medical-history",
        },
        {
          title: "Diet Plan History",
          url: "diet-history",
        },
        {
          title: "Shopping History",
          url: "/order-history",
        },
        {
          title: "Payment History",
          url: "/payment-history",
        },
      ],
    },
  ];

  // Effect to fetch user data when component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Try to get the token from session storage
        const token = sessionStorage.getItem("token");
        
        if (!token) {
          console.log("No authentication token found");
          return;
        }
        
        const response = await fetch(API.PROFILE_GETPROFILE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const data = await response.json();
        console.log("User Data:", data);
        // Update the user data state with fetched information
        setUserData({
          name: data.data.user.name || "User",
          email: data.data.user.email || "",
          avatar: userData.avatar // Retain the current avatar value
        });
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        // Try to get user info from session storage as fallback
        const username = sessionStorage.getItem("username");
        const email = sessionStorage.getItem("email");
        
        if (username || email) {
          setUserData({
            name: username || "User",
            email: email || "",
            avatar: "/avatars/default-avatar.jpg"
          });
        }
      }
    }
    
    fetchUserData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
