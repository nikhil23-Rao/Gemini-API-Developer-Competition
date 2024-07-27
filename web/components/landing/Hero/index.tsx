"use client";
import Image from "next/image";
import { useState } from "react";
import Lottie from "lottie-react";
import heroAnimation from "../../../public/hero.json";
import { login } from "@/utils/signInWithGoogle";

const Hero = () => {
  const options = {
    animationData: heroAnimation,
    loop: true,
    autoplay: true,
  };

  return (
    <>
      <section
        className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46"
        style={{ marginTop: -70 }}
      >
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
              <h1 className="mb-5 pr-16 text-5xl font-bold text-black dark:text-white xl:text-hero ">
                The Student Life Of
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                  The Future
                </span>
              </h1>
              <p>
                An AI-powered application crafted to help students stay
                productive. Combined with integrations from various other
                applications, the features in this app combine to form an
                amazing user experience, to keep a student's workflow
                consistent. Every. Single. Day. For completely free. Get started
                now!
              </p>

              <div className="mt-10">
                <div className="flex flex-wrap gap-5">
                  <button
                    aria-label="get started button"
                    className="flex rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                    onClick={login}
                  >
                    Get Started
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 40,
                    width: "100%",
                  }}
                >
                  <p
                    style={{
                      fontSize: 18,
                      marginTop: 22,
                      marginRight: -1,
                      color: "gray",
                    }}
                  >
                    Powered by
                  </p>
                  <img src="/gemini.png" style={{ zoom: 0.1 }} alt="" />
                </div>
              </div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div
                  className=" relative aspect-[700/144] w-full"
                  style={{ width: 450, zoom: 1.5 }}
                >
                  <Lottie animationData={heroAnimation} loop />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
