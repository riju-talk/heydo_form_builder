import { createContext, useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import { FaRegFileImage } from "react-icons/fa";

// import { color } from "@cloudinary/url-gen/qualifiers/background";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidget({ uwConfig, setPublicId, setImgUrl, showtext }) {
  const [loaded, setLoaded] = useState(false);
  const [Pending, setPending] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    
    if (!loaded) {
      
      const uwScript = document.getElementById("uw");
      setPending(false);
      if (!uwScript) {
        // If not loaded, create and load the script
        
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
       
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
    {
      
  }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    // setPending(true);
    
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(uwConfig, (error, result) => {
        if (!error && result && result.event === "success") {
          // trigger();
          // console.log("Done! Here is the image info: ", result.info);
          setPublicId(result.info.public_id);
          setImgUrl(result.info.secure_url);
        }
      });
      myWidget.open();
      {document.getElementsByClassName}
    }
    setPending(false);
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
     
    
      <div className="bg-red-200 cursor-pointer font-medium w-full"   
        onClick={() => {
          initializeCloudinaryWidget();
        }}
      >

        
        <div   className="po justify-center gap-4 flex flex-row items-center"> <span>{showtext}</span>
        <span className="text-lg"><FaRegFileImage/></span></div>
       
        
      </div>
    </CloudinaryScriptContext.Provider>
  );
}



export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
