"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  HandCoins,
  CreditCard,
  TrendingUp,
  Calendar,
  Percent,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Banknote,
  PiggyBank,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Award,
  Heart,
} from "lucide-react"

// Mock auth object - replace with your actual auth logic
const mockAuth = {
  user: null, // Set to user object when authenticated
}

// Mock route function - replace with your actual routing
const route = (name: string) => `/${name}`

// Mock Link component - replace with your actual Link component
const Link = ({ href, className, children, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
)

// Intersection Observer Hook for scroll animations
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.1, ...options },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, isIntersecting] as const
}

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const auth = mockAuth // Replace with actual auth

  // Force dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark")
    setIsVisible(true)
  }, [])

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection observers for different sections
  const [heroRef, heroInView] = useIntersectionObserver()
  const [statsRef, statsInView] = useIntersectionObserver()
  const [howItWorksRef, howItWorksInView] = useIntersectionObserver()
  const [loanRatesRef, loanRatesInView] = useIntersectionObserver()
  const [membersRef, membersInView] = useIntersectionObserver()
  const [featuresRef, featuresInView] = useIntersectionObserver()

  const members = [
    { name: "Norman", role: "Chairman", avatar: "N", color: "from-blue-500 to-blue-600" },
    { name: "Ernest", role: "Treasury", avatar: "E", color: "from-green-500 to-green-600" },
    { name: "Kelvin", role: "Founder", avatar: "K", color: "from-purple-500 to-purple-600" },
    { name: "Timon", role: "Founder", avatar: "T", color: "from-orange-500 to-orange-600" },
    { name: "Obadia", role: "Founder", avatar: "O", color: "from-red-500 to-red-600" },
    { name: "Dennis", role: "Founder", avatar: "D", color: "from-indigo-500 to-indigo-600" },
  ]

  const loanRates = [
    { duration: "1 Week", rate: "5%", popular: false, icon: Calendar },
    { duration: "2 Weeks", rate: "10%", popular: true, icon: Star },
    { duration: "3 Weeks", rate: "15%", popular: false, icon: TrendingUp },
    { duration: "4 Weeks", rate: "20%", popular: false, icon: Target },
  ]

  const stats = [
    { label: "Active Members", value: "6", icon: Users, color: "text-blue-500" },
    { label: "Monthly Contribution", value: "KSH 1,000", icon: HandCoins, color: "text-green-500" },
    { label: "Savings Rate", value: "50%", icon: PiggyBank, color: "text-purple-500" },
    { label: "Loan Interest", value: "5-20%", icon: Percent, color: "text-orange-500" },
  ]

  const features = [
    {
      icon: CheckCircle,
      title: "Guaranteed Returns",
      description: "CIC Money Market funds provide consistent interest on your savings",
      color: "text-green-500",
    },
    {
      icon: Shield,
      title: "Disciplined Approach",
      description: "Strict contribution schedule builds financial discipline",
      color: "text-blue-500",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Welfare fund for genuine emergencies and difficult situations",
      color: "text-purple-500",
    },
    {
      icon: CreditCard,
      title: "Quick Loans",
      description: "Emergency loans with fair interest rates when you need them",
      color: "text-orange-500",
    },
    {
      icon: Target,
      title: "Expanding Network",
      description: "Growing community of genuine, disciplined individuals",
      color: "text-red-500",
    },
    {
      icon: Calendar,
      title: "Rotating Benefits",
      description: "Monthly rotation ensures everyone benefits from the system",
      color: "text-indigo-500",
    },
  ]

  return (
    <div className="dark min-h-screen transition-all duration-500">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden">
        {/* Enhanced Sticky Header */}
        <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg transition-all duration-300 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16 lg:h-18">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0 group">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-white animate-pulse-glow group-hover:animate-wiggle" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold hover:scale-105 transition-transform duration-300">
                      <span className="text-green-400 font-bold">NextGen</span>
                      <span className="text-white font-bold ml-1">Welfare</span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-400 hidden sm:block truncate max-w-[160px] lg:max-w-none">
                      Building Financial Discipline
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
                >
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#services"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
                >
                  Services
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#team"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
                >
                  Team
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-primary/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {auth.user ? (
                  <Link href={route("dashboard")}>
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 whitespace-nowrap hover:scale-105 shadow-lg hover:shadow-xl">
                      <span className="hidden sm:inline">Dashboard</span>
                      <span className="sm:hidden">Panel</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="hidden lg:flex items-center space-x-2">
                    <Link href={route("login")}>
                      <Button
                        variant="ghost"
                        className="hover:bg-primary/10 whitespace-nowrap hover:scale-105 transition-all duration-300"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href={route("register")}>
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 whitespace-nowrap hover:scale-105 shadow-lg hover:shadow-xl">
                        Join Us
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t bg-background/98 backdrop-blur-lg animate-slide-up shadow-lg">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a
                    href="#about"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Services
                  </a>
                  <a
                    href="#team"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Team
                  </a>
                  <a
                    href="#contact"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                  {!auth.user && (
                    <div className="px-3 py-2 space-y-2 border-t pt-4 mt-4">
                      <Link href={route("login")}>
                        <Button variant="outline" className="w-full bg-transparent hover:bg-primary/5">
                          Log in
                        </Button>
                      </Link>
                      <Link href={route("register")}>
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-lg">
                          Join Us
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32 xl:py-40"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-5xl mx-auto">
              <div className={`space-responsive ${heroInView ? "animate-fade-in-scale" : "opacity-0"}`}>
                <Badge
                  variant="secondary"
                  className="animate-float mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span className="text-xs sm:text-sm">6 Founding Members Strong</span>
                </Badge>

                <h1 className="text-responsive-3xl font-bold tracking-tight mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-shimmer">
                    NextGen Welfare
                  </span>
                  <br />
                  <span className="text-responsive-2xl text-muted-foreground">
                    Building Financial Discipline Together
                  </span>
                </h1>

                <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
                  Join our exclusive welfare group where discipline meets opportunity. We contribute KSH 1,000 monthly,
                  save 50% in CIC Money Market funds, and support each other through our rotating contribution system.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 sm:pt-6">
                  {!auth.user && (
                    <>
                      <Link href={route("register")}>
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:scale-105 hover-glow animate-bounce-in"
                        >
                          <UserCheck className="mr-2 h-5 w-5" />
                          Apply to Join
                        </Button>
                      </Link>
                      <Link href={route("login")}>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-primary/5 bg-transparent hover:scale-105 transition-all duration-300 animate-bounce-in stagger-1"
                        >
                          Member Login
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Scroll Indicator */}
                <div className="mt-12 sm:mt-16 animate-bounce">
                  <ChevronDown className="h-6 w-6 mx-auto text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section ref={statsRef} className="py-12 sm:py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-responsive">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className={`text-center hover-lift transition-all duration-500 ${
                    statsInView ? "animate-bounce-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <stat.icon
                      className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} mx-auto mb-3 animate-float`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    />
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced How It Works */}
        <section ref={howItWorksRef} id="about" className="py-responsive">
          <div className="container mx-auto px-responsive">
            <div className={`text-center mb-12 sm:mb-16 ${howItWorksInView ? "animate-slide-up" : "opacity-0"}`}>
              <Badge variant="secondary" className="mb-4 animate-float">
                <Zap className="w-3 h-3 mr-1" />
                How It Works
              </Badge>
              <h2 className="text-responsive-2xl font-bold mb-4">NextGen Welfare System</h2>
              <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto">
                Our systematic approach to building wealth and supporting each other
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: HandCoins,
                  title: "Monthly Contribution",
                  description:
                    "Every member contributes KSH 1,000 before the 5th of each month. Consistency builds discipline and trust.",
                  step: "1",
                },
                {
                  icon: PiggyBank,
                  title: "Smart Allocation",
                  description:
                    "KSH 500 goes to CIC Money Market funds for compound interest. KSH 500 rotates among members monthly.",
                  step: "2",
                },
                {
                  icon: TrendingUp,
                  title: "Wealth Building",
                  description:
                    "Earn interest from savings, access emergency loans, and benefit from our welfare support system.",
                  step: "3",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className={`relative overflow-hidden hover-lift group transition-all duration-500 ${
                    howItWorksInView ? "animate-slide-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{item.step}</span>
                    </div>
                    <item.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4 group-hover:scale-110 group-hover:animate-wiggle transition-all duration-300" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Loan Rates */}
        <section ref={loanRatesRef} className="py-responsive bg-muted/30">
          <div className="container mx-auto px-responsive">
            <div className={`text-center mb-12 sm:mb-16 ${loanRatesInView ? "animate-slide-up" : "opacity-0"}`}>
              <Badge variant="secondary" className="mb-4 animate-float">
                <Percent className="w-3 h-3 mr-1" />
                Loan Rates
              </Badge>
              <h2 className="text-responsive-2xl font-bold mb-4">Emergency Loan Rates</h2>
              <p className="text-responsive-lg text-muted-foreground">Quick access to funds when you need them most</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {loanRates.map((rate, index) => (
                <Card
                  key={rate.duration}
                  className={`relative hover-lift transition-all duration-500 ${
                    rate.popular ? "ring-2 ring-primary scale-105" : ""
                  } ${loanRatesInView ? "animate-bounce-in" : "opacity-0"}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {rate.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary animate-pulse-glow">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <CardContent className="p-4 sm:p-6 text-center">
                    <rate.icon
                      className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-3 animate-float"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                    <div className="text-sm sm:text-lg font-semibold">{rate.duration}</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{rate.rate}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-2">Interest Rate</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Members Section */}
        <section ref={membersRef} id="team" className="py-responsive">
          <div className="container mx-auto px-responsive">
            <div className={`text-center mb-12 sm:mb-16 ${membersInView ? "animate-slide-up" : "opacity-0"}`}>
              <Badge variant="secondary" className="mb-4 animate-float">
                <Users className="w-3 h-3 mr-1" />
                Our Team
              </Badge>
              <h2 className="text-responsive-2xl font-bold mb-4">Our Founding Members</h2>
              <p className="text-responsive-lg text-muted-foreground">
                Meet the disciplined individuals building NextGen Welfare
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {members.map((member, index) => (
                <Card
                  key={member.name}
                  className={`text-center hover-lift group transition-all duration-500 ${
                    membersInView ? "animate-bounce-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-3 group-hover:scale-110 group-hover:animate-wiggle transition-all duration-300`}
                    >
                      {member.avatar}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base">{member.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
                    {member.role === "Chairman" && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Leader
                      </Badge>
                    )}
                    {member.role === "Treasury" && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        <Banknote className="w-3 h-3 mr-1" />
                        Finance
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features */}
        <section ref={featuresRef} className="py-responsive bg-muted/30">
          <div className="container mx-auto px-responsive">
            <div className={`text-center mb-12 sm:mb-16 ${featuresInView ? "animate-slide-up" : "opacity-0"}`}>
              <Badge variant="secondary" className="mb-4 animate-float">
                <Heart className="w-3 h-3 mr-1" />
                Why Choose Us
              </Badge>
              <h2 className="text-responsive-2xl font-bold mb-4">Why Choose NextGen Welfare?</h2>
              <p className="text-responsive-lg text-muted-foreground">Built on discipline, trust, and mutual support</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 group ${
                    featuresInView ? "animate-slide-in-left" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color} group-hover:animate-wiggle`} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        {!auth.user && (
          <section className="py-responsive bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="container mx-auto px-responsive text-center relative">
              <div className="max-w-4xl mx-auto space-responsive">
                <Badge variant="secondary" className="mb-4 animate-float">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Join Today
                </Badge>
                <h2 className="text-responsive-2xl font-bold mb-6">Ready to Build Financial Discipline?</h2>
                <p className="text-responsive-lg text-muted-foreground mb-8 leading-relaxed">
                  Join NextGen Welfare and be part of a community that values discipline, mutual support, and financial
                  growth. We're looking for genuine individuals who are committed to building wealth together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={route("register")}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:scale-105 hover-glow animate-pulse-glow"
                    >
                      <UserCheck className="mr-2 h-5 w-5" />
                      Apply for Membership
                    </Button>
                  </Link>
                  <Link href={route("login")}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-primary/5 bg-transparent hover:scale-105 transition-all duration-300"
                    >
                      Existing Member Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Footer */}
        <footer className="border-t bg-muted/30 py-8 sm:py-12">
          <div className="container mx-auto px-responsive">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary animate-pulse-glow" />
                <div className="text-center md:text-left">
                  <div className="font-bold text-base sm:text-lg">NextGen Welfare</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Building Financial Discipline</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">© 2024 NextGen Welfare. All rights reserved.</p>
                <p className="text-xs text-muted-foreground mt-1">Managed by Norman (Chairman) & Ernest (Treasury)</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
