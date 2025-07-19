import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="ships" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Ships
        </p>

        <AnimatedTitle
          title="In<b>t</b>erface with the world's <br /> strongest neuronic <b>b</b>eacon"
          containerClass="mt-5 !text-white text-center"
        />

        <div className="about-subtext">
          <p>The tools of Unlimited Intelligence await; unlock destiny with them</p>
          <p className="text-gray-500">
            The Mints are the interface for the NeuroVoid, the means to achieve
            an unlimited pool of neuronic intelligence and data.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="massk-clip-path about-image">
          <img
            src="img/mouse.svg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
