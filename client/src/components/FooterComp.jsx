import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

function FooterComp() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full mx-w-7xl mx-auto sm:px-7">
        <div className="grid w-full gap-5 justify-between sm:flex md:grid-cols-1">
          {/* logo section */}

          <div className="mt-5">
            <Link
              to="/"
              className=" self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Nilesh's
              </span>
              Blog
            </Link>
          </div>
          {/* about,follow and policy section */}

          <div className="grid grid-cols-2  sm:grid-cols-3 sm:gap-8">
            <div className="mt-7 sm:mt-0">
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Nilesh1901/Notes-App"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Notes Management App
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nilesh's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="mt-7 sm:mt-0">
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.linkedin.com/in/nilesh-patel-465b50263/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </Footer.Link>
                <Footer.Link
                  href="https://github.com/Nilesh1901"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="mt-7 sm:mt-0">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        {/* copyright section */}

        <div>
          <Footer.Copyright
            href="#"
            by="Nilesh's blog"
            year={new Date().getFullYear()}
          />
        </div>
        {/* social media section */}

        <div className="flex sm:justify-center gap-6 mt-5">
          <Footer.Icon href="#" icon={FaFacebook} />
          <Footer.Icon href="#" icon={FaInstagram} />
          <Footer.Icon href="#" icon={FaTwitter} />
          <Footer.Icon href="https://github.com/Nilesh1901" icon={FaGithub} />
        </div>
      </div>
    </Footer>
  );
}

export default FooterComp;
