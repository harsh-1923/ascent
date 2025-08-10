import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/mdx-components";

const SMDX = ({ content }: { content: string }) => {
  return (
    <div className="debug">
      <MDXRemote source={content || ""} components={components} />
    </div>
  );
};

export default SMDX;
