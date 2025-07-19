import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CreditCard, FileText, HandCoins, LayoutGrid, PiggyBank, Target } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role?: string } } }>().props;
    const userRole = auth.user.role;
    const isAdminOrTreasurer = userRole === 'admin' || userRole === 'treasurer';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Contributions',
            href: '/contributions',
            icon: HandCoins,
        },
        {
            title: 'My Contributions',
            href: '/my-contributions',
            icon: HandCoins,
        },
        {
            title: 'Loans',
            href: '/loans',
            icon: CreditCard,
        },
    ];

    // Add admin/treasurer only items
    if (isAdminOrTreasurer) {
        mainNavItems.push(
            {
                title: 'CIC Investments',
                href: '/cic-investments',
                icon: PiggyBank,
            },
            {
                title: 'Milestones',
                href: '/milestones',
                icon: Target,
            },
            {
                title: 'Reports',
                href: '/reports',
                icon: FileText,
            }
        );
    }

    // Add admin only items
    if (userRole === 'admin') {
        mainNavItems.push(
            {
                title: 'Admin Panel',
                href: '/admin',
                icon: FileText,
            }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
