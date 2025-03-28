import { Users, Target, Shield, Globe, Leaf, Car, Heart, MapPin, Zap, DollarSign, Smile } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Transforming <span className="text-blue-200">Commutes</span>,<br />
            Connecting <span className="text-blue-200">Communities</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed">
            At RideBuddy, we're on a mission to revolutionize daily commuting, making it more sustainable, affordable,
            and social for everyone.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Our Story"
                className="rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6 md:mb-8">Our Story</h2>
              <p className="text-lg md:text-xl text-blue-700 mb-4 md:mb-6 leading-relaxed">
                Founded in 2025, RideBuddy emerged from a simple observation: too many cars on the road with just one
                person in them. We believed there had to be a better way to commute.
              </p>
              <p className="text-lg md:text-xl text-blue-700 leading-relaxed mb-6 md:mb-8">
                What started as a small carpooling initiative has grown into a nationwide community of conscious
                commuters who share not just rides, but also a vision for a more sustainable future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-900 mb-12 md:mb-20">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[
              {
                icon: <Shield className="h-8 w-8 md:h-10 md:w-10" />,
                title: "Safety First",
                description: "We prioritize the safety and security of our community above all else.",
              },
              {
                icon: <Globe className="h-8 w-8 md:h-10 md:w-10" />,
                title: "Sustainability",
                description: "Every shared ride contributes to a healthier planet for future generations.",
              },
              {
                icon: <Users className="h-8 w-8 md:h-10 md:w-10" />,
                title: "Community",
                description: "Building meaningful connections through shared journeys.",
              },
              {
                icon: <Heart className="h-8 w-8 md:h-10 md:w-10" />,
                title: "Trust",
                description: "Fostering a reliable and transparent environment for all users.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 p-3 md:p-4 rounded-2xl w-fit mb-4 md:mb-6">{value.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3 md:mb-4">{value.title}</h3>
                <p className="text-base md:text-lg text-blue-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-20">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <div className="text-center p-8 md:p-10 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Car className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-blue-200" />
              <div className="text-lg md:text-xl text-blue-200">Active Drivers</div>
            </div>
            <div className="text-center p-8 md:p-10 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <MapPin className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-blue-200" />
              <div className="text-lg md:text-xl text-blue-200">Cities Covered across India</div>
            </div>
            <div className="text-center p-8 md:p-10 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Leaf className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 md:mb-6 text-blue-200" />
              <div className="text-lg md:text-xl text-blue-200">CO₂ Emissions Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-900 mb-12 md:mb-20">Why Choose RideBuddy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                icon: <Zap className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />,
                title: "Efficient Commutes",
                description: "Save time with optimized routes and reduced traffic congestion.",
              },
              {
                icon: <DollarSign className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />,
                title: "Cost-Effective",
                description: "Share ride expenses and significantly reduce your commuting costs.",
              },
              {
                icon: <Smile className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />,
                title: "Social Experience",
                description: "Meet like-minded individuals and make your commute more enjoyable.",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 md:mb-6">{benefit.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3 md:mb-4">{benefit.title}</h3>
                <p className="text-base md:text-lg text-blue-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-900 mb-12 md:mb-20">Developers Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                name: "Swaraj Nalawade",
                image:
                  "https://res.cloudinary.com/dhn7loytz/image/upload/v1740600129/WhatsApp_Image_2025-02-27_at_1.29.56_AM_fdptw5.jpg",
              },
              {
                name: "Lalit Mohane",
                image:
                  "https://res.cloudinary.com/dhn7loytz/image/upload/v1740599166/WhatsApp_Image_2025-02-27_at_1.13.55_AM_tkaa78.jpg",
              },
              {
                name: "Kalpak Kulkarni",
                image:
                  "https://res.cloudinary.com/dhn7loytz/image/upload/v1740599267/kalpak_a5g4c3.png",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-4 md:mb-6 object-cover border-4 border-blue-100"
                />
                <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">{member.name}</h3>
                <p className="text-lg md:text-xl text-blue-700">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About