"use client";

import { useThemeStore } from "@/lib/store/theme.store";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    Bell,
    CreditCard,
    LayoutDashboard,
    Moon,
    Settings,
    Sun,
    User,
    TrendingUp,
    ShoppingCart,
    Users,
} from "lucide-react";

function StatCard({
    title,
    value,
    change,
    icon: Icon,
}: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{change}</p>
            </CardContent>
        </Card>
    );
}

function DashboardPreview() {
    return (
        <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                <StatCard
                    title="Total Revenue"
                    value="$45,231"
                    change="+20.1% from last month"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Orders"
                    value="2,350"
                    change="+15.3% from last month"
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Active Users"
                    value="12,234"
                    change="+8.2% from last month"
                    icon={Users}
                />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-3 gap-3">
                {/* Recent activity */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your team has 6 active projects this week
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { name: "Sarah Chen", action: "Deployed to production", time: "2m ago", badge: "success" },
                            { name: "Marcus Reid", action: "Opened pull request #142", time: "18m ago", badge: "default" },
                            { name: "Priya Nair", action: "Flagged a critical bug", time: "1h ago", badge: "destructive" },
                            { name: "Tom Okafor", action: "Merged branch feature/auth", time: "3h ago", badge: "secondary" },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                        {item.name.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.action}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            item.badge === "destructive"
                                                ? "destructive"
                                                : item.badge === "secondary"
                                                    ? "secondary"
                                                    : "default"
                                        }
                                        className="text-xs"
                                    >
                                        {item.badge === "success" ? "Deployed" :
                                            item.badge === "destructive" ? "Bug" :
                                                item.badge === "secondary" ? "Merged" : "PR"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Quick actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start gap-2" size="sm">
                            <LayoutDashboard className="h-4 w-4" />
                            New Project
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                            <User className="h-4 w-4" />
                            Invite Member
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                            <Bell className="h-4 w-4" />
                            Notifications
                        </Button>
                        <Button variant="secondary" className="w-full justify-start gap-2" size="sm">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            3 pending notifications
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

function FormsPreview() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Sign in form */}
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full">Sign In</Button>
                    <Button variant="ghost" className="w-full text-sm">
                        Forgot password?
                    </Button>
                </CardFooter>
            </Card>

            {/* Profile form */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input placeholder="Your name" defaultValue="Alex Johnson" />
                    </div>
                    <div className="space-y-2">
                        <Label>Username</Label>
                        <Input placeholder="@username" defaultValue="@alexj" />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <div className="flex gap-2">
                            <Badge>Admin</Badge>
                            <Badge variant="secondary">Designer</Badge>
                            <Badge variant="outline">Pro</Badge>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button size="sm">Save Changes</Button>
                    <Button size="sm" variant="outline">Cancel</Button>
                </CardFooter>
            </Card>

            {/* Billing card */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Billing
                    </CardTitle>
                    <CardDescription>Manage your subscription and payment</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Pro Plan</p>
                            <p className="text-sm text-muted-foreground">$29/month · Renews Dec 1, 2025</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Change Plan</Button>
                            <Button variant="destructive" size="sm">Cancel</Button>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Payment method</span>
                        <span className="font-mono">•••• •••• •••• 4242</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function PreviewCanvas() {
    const isDark = useThemeStore((s) => s.isDark);
    const toggleDark = useThemeStore((s) => s.toggleDark);
    const primaryHex = useThemeStore((s) => s.current.primaryHex);
    const harmonyType = useThemeStore((s) => s.current.harmonyType);

    return (
        <div className="flex h-full flex-col">
            {/* Preview toolbar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Preview
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                        {primaryHex}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {harmonyType}
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleDark}
                    title="Toggle dark mode"
                >
                    {isDark ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto p-4">
                <Tabs defaultValue="dashboard" className="flex flex-col w-full">
                    <TabsList className="mb-4 self-start">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="forms">Forms & Cards</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard">
                        <DashboardPreview />
                    </TabsContent>
                    <TabsContent value="forms">
                        <FormsPreview />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}