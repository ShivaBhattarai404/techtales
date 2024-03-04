import About from '@/components/About/About';
import FaQLoadingSkeleton from "@/components/FAQ/loader";

const AboutPage = () => {
  return (
    <main>
      <About />
      <FaQLoadingSkeleton />
    </main>
  )
}

export default AboutPage