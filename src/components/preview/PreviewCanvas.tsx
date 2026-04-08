"use client";

import { useState } from "react";
import { useThemeStore } from "@/lib/store/theme.store";
import { serializeTheme } from "@/lib/store/url-sync";
import { FONT_PAIRS } from "@/lib/typography/registry";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    Bell, Check, CreditCard, LayoutDashboard, Moon, Settings,
    Share2, Sun, User, TrendingUp, ShoppingCart, Users,
    Mail, Star, Archive, Trash2, Reply, CheckSquare,
    Circle, ArrowRight, Zap, Sparkles,
} from "lucide-react";

// ── Typography Preview ───────────────────────────────────────────
function TypographyPreview() {
    const fontPairId = useThemeStore((s) => s.current.fontPairId);
    const pair = FONT_PAIRS.find((p) => p.id === fontPairId) ?? FONT_PAIRS[0];

    const displayFont = `"${pair.display.name}", sans-serif`;
    const bodyFont = `"${pair.body.name}", sans-serif`;
    const monoFont = `"${pair.mono.name}", monospace`;

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Display scale */}
            <div className="space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Display — {pair.display.name}
                </p>
                <div className="space-y-2">
                    <p style={{ fontFamily: displayFont, fontSize: "3rem", fontWeight: 700, lineHeight: 1.1 }}
                        className="text-foreground">
                        The quick brown fox
                    </p>
                    <p style={{ fontFamily: displayFont, fontSize: "2rem", fontWeight: 600, lineHeight: 1.2 }}
                        className="text-foreground">
                        Jumps over the lazy dog
                    </p>
                    <p style={{ fontFamily: displayFont, fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.3 }}
                        className="text-foreground">
                        Design systems at scale
                    </p>
                    <p style={{ fontFamily: displayFont, fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.4 }}
                        className="text-foreground">
                        Building with intention and clarity
                    </p>
                </div>
            </div>

            <Separator />

            {/* Body scale */}
            <div className="space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Body — {pair.body.name}
                </p>
                <div className="space-y-3">
                    <p style={{ fontFamily: bodyFont, fontSize: "1.125rem", lineHeight: 1.7 }}
                        className="text-foreground">
                        Large body — A well-crafted design system is the foundation of every great product.
                        It ensures consistency, accelerates development, and creates a shared language
                        between designers and engineers.
                    </p>
                    <p style={{ fontFamily: bodyFont, fontSize: "1rem", lineHeight: 1.6 }}
                        className="text-foreground">
                        Base body — Typography is not just about choosing fonts. It is about establishing
                        rhythm, hierarchy, and tone. Every size, weight, and spacing decision communicates
                        something to the reader before they even process the words.
                    </p>
                    <p style={{ fontFamily: bodyFont, fontSize: "0.875rem", lineHeight: 1.6 }}
                        className="text-muted-foreground">
                        Small body — Supporting text, captions, and metadata. Used for secondary information
                        that contextualizes the primary content without competing with it.
                    </p>
                    <p style={{ fontFamily: bodyFont, fontSize: "0.75rem", lineHeight: 1.5 }}
                        className="text-muted-foreground">
                        Caption — Timestamps, labels, footnotes. 12px minimum for readability.
                    </p>
                </div>
            </div>

            <Separator />

            {/* Mono scale */}
            <div className="space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Mono — {pair.mono.name}
                </p>
                <div className="space-y-2">
                    <p style={{ fontFamily: monoFont, fontSize: "0.875rem", lineHeight: 1.7 }}
                        className="text-foreground">
                        const theme = generateHarmony(&quot;#6d28d9&quot;, &quot;analogous&quot;);
                    </p>
                    <p style={{ fontFamily: monoFont, fontSize: "0.875rem", lineHeight: 1.7 }}
                        className="text-foreground">
                        --primary: oklch(0.5739 0.2318 293.54);
                    </p>
                    <p style={{ fontFamily: monoFont, fontSize: "0.875rem", lineHeight: 1.7 }}
                        // eslint-disable-next-line react/jsx-no-comment-textnodes
                        className="text-muted-foreground">
            // Border radius: 8px · Ideology: glassmorphism · Harmony: triadic
                    </p>
                </div>
            </div>

            <Separator />

            {/* Color + type combinations */}
            <div className="space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Token Combinations
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { bg: "var(--primary)", fg: "var(--primary-foreground)", label: "Primary" },
                        { bg: "var(--secondary)", fg: "var(--secondary-foreground)", label: "Secondary" },
                        { bg: "var(--accent)", fg: "var(--accent-foreground)", label: "Accent" },
                        { bg: "var(--muted)", fg: "var(--muted-foreground)", label: "Muted" },
                        { bg: "var(--destructive)", fg: "var(--destructive-foreground)", label: "Destructive" },
                        { bg: "var(--card)", fg: "var(--card-foreground)", label: "Card" },
                    ].map((combo) => (
                        <div key={combo.label}
                            className="rounded-md p-3 border border-border"
                            style={{ backgroundColor: combo.bg, color: combo.fg }}>
                            <p style={{ fontFamily: displayFont, fontSize: "1rem", fontWeight: 600 }}>
                                {combo.label}
                            </p>
                            <p style={{ fontFamily: bodyFont, fontSize: "0.75rem", opacity: 0.8 }}>
                                Background + foreground pair
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Hero Preview ─────────────────────────────────────────────────
function HeroPreview() {
    const fontPairId = useThemeStore((s) => s.current.fontPairId);
    const pair = FONT_PAIRS.find((p) => p.id === fontPairId) ?? FONT_PAIRS[0];
    const displayFont = `"${pair.display.name}", sans-serif`;
    const bodyFont = `"${pair.body.name}", sans-serif`;

    return (
        <div className="space-y-8">
            {/* Hero section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Nav */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-primary" />
                        <span style={{ fontFamily: displayFont }}
                            className="text-sm font-semibold text-foreground">
                            BrandName
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        {["Product", "Pricing", "Docs", "Blog"].map((item) => (
                            <span key={item}
                                style={{ fontFamily: bodyFont }}
                                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Sign in</Button>
                        <Button size="sm">Get started</Button>
                    </div>
                </div>

                {/* Hero content */}
                <div className="px-6 py-16 text-center space-y-6 bg-background">
                    <Badge variant="secondary" className="gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Now in public beta
                    </Badge>

                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h1
                            style={{ fontFamily: displayFont, fontSize: "3.5rem", fontWeight: 700, lineHeight: 1.1 }}
                            className="text-foreground">
                            Design systems that
                            <span className="text-primary"> just work</span>
                        </h1>
                        <p
                            style={{ fontFamily: bodyFont, fontSize: "1.125rem", lineHeight: 1.7 }}
                            className="text-muted-foreground">
                            Generate mathematically harmonious design systems from a single color.
                            Export to CSS, Tailwind, or JSON. Ship faster without sacrificing quality.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <Button size="lg" className="gap-2">
                            Start for free
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            View examples
                        </Button>
                    </div>

                    <p style={{ fontFamily: bodyFont }}
                        className="text-xs text-muted-foreground">
                        No credit card required · Free forever for personal projects
                    </p>
                </div>

                {/* Feature strip */}
                <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                    {[
                        { icon: Zap, title: "Instant generation", desc: "Full design system in under a second" },
                        { icon: Check, title: "WCAG compliant", desc: "All token pairs meet 4.5:1 contrast" },
                        { icon: Sparkles, title: "10 ideologies", desc: "From Glassmorphism to Neo-Brutalism" },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="px-6 py-5 bg-card">
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-4 w-4 text-primary" />
                                <span style={{ fontFamily: bodyFont }}
                                    className="text-sm font-semibold text-foreground">
                                    {title}
                                </span>
                            </div>
                            <p style={{ fontFamily: bodyFont }}
                                className="text-xs text-muted-foreground">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    {
                        name: "Free", price: "$0", desc: "For personal projects",
                        features: ["5 themes", "CSS export", "URL sharing"],
                        cta: "Get started", variant: "outline" as const,
                    },
                    {
                        name: "Pro", price: "$12", desc: "For professional designers",
                        features: ["Unlimited themes", "All exports", "AI design guide", "Logo upload"],
                        cta: "Start free trial", variant: "default" as const,
                        featured: true,
                    },
                    {
                        name: "Team", price: "$39", desc: "For design teams",
                        features: ["Everything in Pro", "Team favourites", "Shared library", "Priority support"],
                        cta: "Contact us", variant: "outline" as const,
                    },
                ].map((plan) => (
                    <Card key={plan.name}
                        className={plan.featured ? "border-primary ring-1 ring-primary" : ""}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle style={{ fontFamily: displayFont }}>{plan.name}</CardTitle>
                                {plan.featured && <Badge>Popular</Badge>}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span style={{ fontFamily: displayFont, fontSize: "2rem", fontWeight: 700 }}
                                    className="text-foreground">
                                    {plan.price}
                                </span>
                                <span className="text-sm text-muted-foreground">/mo</span>
                            </div>
                            <CardDescription style={{ fontFamily: bodyFont }}>{plan.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {plan.features.map((f) => (
                                <div key={f} className="flex items-center gap-2">
                                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span style={{ fontFamily: bodyFont }} className="text-sm">{f}</span>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button variant={plan.variant} className="w-full">{plan.cta}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// ── Dashboard Preview ─────────────────────────────────────────────
function DashboardPreview() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                {[
                    { title: "Total Revenue", value: "$45,231", change: "+20.1% from last month", icon: TrendingUp },
                    { title: "Orders", value: "2,350", change: "+15.3% from last month", icon: ShoppingCart },
                    { title: "Active Users", value: "12,234", change: "+8.2% from last month", icon: Users },
                ].map(({ title, value, change, icon: Icon }) => (
                    <Card key={title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your team has 6 active projects this week</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { name: "Sarah Chen", action: "Deployed to production", time: "2m ago", badge: "default", label: "Deployed" },
                            { name: "Marcus Reid", action: "Opened pull request #142", time: "18m ago", badge: "secondary", label: "PR" },
                            { name: "Priya Nair", action: "Flagged a critical bug", time: "1h ago", badge: "destructive", label: "Bug" },
                            { name: "Tom Okafor", action: "Merged branch feature/auth", time: "3h ago", badge: "secondary", label: "Merged" },
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
                                    <Badge variant={item.badge as "default" | "secondary" | "destructive"}>{item.label}</Badge>
                                    <span className="text-xs text-muted-foreground">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start gap-2" size="sm">
                            <LayoutDashboard className="h-4 w-4" />New Project
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                            <User className="h-4 w-4" />Invite Member
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                            <Bell className="h-4 w-4" />Notifications
                        </Button>
                        <Button variant="secondary" className="w-full justify-start gap-2" size="sm">
                            <Settings className="h-4 w-4" />Settings
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">3 pending notifications</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// ── Forms Preview ─────────────────────────────────────────────────
function FormsPreview() {
    return (
        <div className="grid grid-cols-2 gap-4">
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
                    <Button variant="ghost" className="w-full text-sm">Forgot password?</Button>
                </CardFooter>
            </Card>

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

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />Billing
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

// ── Mail Preview ──────────────────────────────────────────────────
function MailPreview() {
    const [selected, setSelected] = useState(0);

    const emails = [
        { from: "Sarah Chen", subject: "Q3 Design Review", preview: "Hey, I've finished the Figma file for the Q3 review. Can you take a look before...", time: "2m ago", read: false, tag: "Work" },
        { from: "Vercel", subject: "Your deployment is live", preview: "Your project ai-design-engineer was successfully deployed to production at...", time: "1h ago", read: false, tag: "Dev" },
        { from: "Marcus Reid", subject: "Re: Brand guidelines", preview: "I agree with your comments on the typography. Let's schedule a call to discuss...", time: "3h ago", read: true, tag: "Work" },
        { from: "GitHub", subject: "PR #142 merged", preview: "Pull request 'feat: add ideology blend system' was successfully merged into main...", time: "5h ago", read: true, tag: "Dev" },
        { from: "Priya Nair", subject: "Bug report: dark mode", preview: "Found an issue with the dark mode toggle on Safari. The background doesn't...", time: "1d ago", read: true, tag: "Bug" },
    ];

    const selectedEmail = emails[selected];

    return (
        <div className="grid grid-cols-5 gap-0 rounded-xl border border-border overflow-hidden h-[480px]">
            {/* Sidebar */}
            <div className="col-span-2 border-r border-border bg-card flex flex-col">
                <div className="px-3 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Inbox</span>
                    <Badge variant="secondary">{emails.filter(e => !e.read).length}</Badge>
                </div>
                <div className="flex-1 overflow-auto">
                    {emails.map((email, i) => (
                        <div
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`px-3 py-3 border-b border-border cursor-pointer transition-colors ${selected === i ? "bg-primary/10" : "hover:bg-muted/50"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-0.5">
                                <span className={`text-xs font-semibold ${!email.read ? "text-foreground" : "text-muted-foreground"}`}>
                                    {email.from}
                                </span>
                                <span className="text-xs text-muted-foreground">{email.time}</span>
                            </div>
                            <p className={`text-xs truncate ${!email.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {email.subject}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{email.preview}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Email view */}
            <div className="col-span-3 flex flex-col bg-background">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Reply className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Archive className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Star className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{selectedEmail.subject}</h2>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-semibold">
                                    {selectedEmail.from[0]}
                                </div>
                                <span className="text-xs text-muted-foreground">{selectedEmail.from}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{selectedEmail.tag}</Badge>
                        </div>
                    </div>
                    <Separator />
                    <p className="text-sm text-foreground leading-relaxed">
                        {selectedEmail.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                    </p>
                    <div className="flex gap-2 pt-2">
                        <Button size="sm" className="gap-1.5">
                            <Reply className="h-3.5 w-3.5" />Reply
                        </Button>
                        <Button size="sm" variant="outline">Forward</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Tasks Preview ─────────────────────────────────────────────────
function TasksPreview() {
    const columns = [
        {
            title: "Backlog", color: "text-muted-foreground",
            tasks: [
                { title: "Research competitor design systems", tag: "Research", priority: "low" },
                { title: "Audit current component library", tag: "Design", priority: "medium" },
                { title: "Write design system RFC", tag: "Docs", priority: "low" },
            ],
        },
        {
            title: "In Progress", color: "text-primary",
            tasks: [
                { title: "Build color token engine", tag: "Dev", priority: "high" },
                { title: "Implement OKLCH math", tag: "Dev", priority: "high" },
                { title: "Design ideology picker UI", tag: "Design", priority: "medium" },
            ],
        },
        {
            title: "Review", color: "text-secondary-foreground",
            tasks: [
                { title: "Typography pairing scorer", tag: "Dev", priority: "medium" },
                { title: "Dark mode token generation", tag: "Dev", priority: "high" },
            ],
        },
        {
            title: "Done", color: "text-muted-foreground",
            tasks: [
                { title: "Set up Next.js project", tag: "Dev", priority: "low" },
                { title: "Define ThemeConfig schema", tag: "Dev", priority: "medium" },
                { title: "WCAG contrast enforcer", tag: "Dev", priority: "high" },
            ],
        },
    ];

    const priorityColors: Record<string, string> = {
        high: "destructive",
        medium: "default",
        low: "secondary",
    };

    return (
        <div className="grid grid-cols-4 gap-3">
            {columns.map((col) => (
                <div key={col.title} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <span className={`text-xs font-semibold uppercase tracking-widest ${col.color}`}>
                            {col.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{col.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                        {col.tasks.map((task) => (
                            <Card key={task.title} className="cursor-pointer hover:border-primary/50 transition-colors">
                                <CardContent className="p-3 space-y-2">
                                    <div className="flex items-start gap-2">
                                        {col.title === "Done"
                                            ? <CheckSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                            : <Circle className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
                                        <p className={`text-xs leading-snug ${col.title === "Done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                            {task.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs px-1.5 py-0">{task.tag}</Badge>
                                        <Badge
                                            variant={priorityColors[task.priority] as "destructive" | "default" | "secondary"}
                                            className="text-xs px-1.5 py-0"
                                        >
                                            {task.priority}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main Canvas ───────────────────────────────────────────────────
export function PreviewCanvas() {
    const isDark = useThemeStore((s) => s.isDark);
    const toggleDark = useThemeStore((s) => s.toggleDark);
    const primaryHex = useThemeStore((s) => s.current.primaryHex);
    const harmonyType = useThemeStore((s) => s.current.harmonyType);
    const current = useThemeStore((s) => s.current);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const encoded = serializeTheme(current);
        const url = `${window.location.origin}?theme=${encoded}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Preview
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">{primaryHex}</Badge>
                    <Badge variant="secondary" className="text-xs">{harmonyType}</Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                        onClick={handleShare} title="Copy share link">
                        {copied
                            ? <Check className="h-4 w-4 text-primary" />
                            : <Share2 className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                        onClick={toggleDark} title="Toggle dark mode">
                        {isDark
                            ? <Sun className="h-4 w-4" />
                            : <Moon className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto bg-background p-4" style={{
                backgroundImage: "radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--primary) 15%, transparent), transparent 60%), radial-gradient(ellipse at 80% 20%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 50%)"
            }}>
                <Tabs defaultValue="hero" className="flex flex-col w-full">
                    <TabsList className="mb-4 self-start">
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="forms">Forms</TabsTrigger>
                        <TabsTrigger value="mail">Mail</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="typography">Typography</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hero"><HeroPreview /></TabsContent>
                    <TabsContent value="dashboard"><DashboardPreview /></TabsContent>
                    <TabsContent value="forms"><FormsPreview /></TabsContent>
                    <TabsContent value="mail"><MailPreview /></TabsContent>
                    <TabsContent value="tasks"><TasksPreview /></TabsContent>
                    <TabsContent value="typography"><TypographyPreview /></TabsContent>
                </Tabs>
            </div>
        </div>
    );
}