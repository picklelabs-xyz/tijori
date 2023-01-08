import Image from "next/image";
import { DiscordIcon, GithubIcon, TwitterIcon } from "./SocialIcons";

const Footer = () => {
  return (
    <footer className="container mx-auto shadow-sm">
      <div className="text-gray-500 p-6 text-sm px-6 flex items-center justify-between gap-10">
        <span>Made by Pickle Labs</span>
        <div className="grid grid-cols-2 gap-6">
          <span>Disclaimer</span>
          <span>FAQ</span>
        </div>
        <div className="grid gap-4 grid-cols-3">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="w-5 h-5 fill-slate-500 hover:fill-slate-700" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="w-5 h-5 fill-slate-500 hover:fill-slate-700" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <DiscordIcon className="w-5 h-5 fill-slate-500 hover:fill-slate-700" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
