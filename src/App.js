import "./App.css";
import { useEffect, useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import DocxMerger from "docx-merger";
import Viewer from "./components/Viewer";
import WebViewerContext from "./context/webviewer.js";

const MAX_COUNT = 50;

function App() {
  const [instance, setInstance] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState();
  const [fileLimit, setFileLimit] = useState(false);
  const [docs, addDocument] = useState([]);
  // generate DOCX document
  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    console.log(uploaded);
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} file`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };
  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };


  const mergeDocuments = async () => {
    if (uploadedFiles.length > 0) {
      const doc=[]
      console.log(doc)
      console.log( uploadedFiles[0])
      console.log( uploadedFiles[1])
     
      let i;
      for (i = 0; i < uploadedFiles.length; i++) {
        let doc2 = await instance.Core.createDocument(uploadedFiles[i]);
        console.log(doc2)
        doc.push(doc2)
         
      }
      console.log(doc)
      addDocument(doc)
      
      
    }
    
  };

  useEffect(() => {
    const generateAndLoadDocument = async () => {
      

        await instance.Core.documentViewer.loadDocument(docs, {
          extension: "docx",
        });
      }
    
  
    if (instance) {
      generateAndLoadDocument();
    }
  }, [instance, docs ]);

  
  return (
   
     <WebViewerContext.Provider value={{ instance, setInstance }}>
     <input
       type="file"
       multiple
       onChange={handleFileEvent}
       disabled={fileLimit}
     />

     {uploadedFiles.map((file) => (
       <div>{file.name}</div>
     ))}
    
      <p>Drop the thumbs from the viewers here</p>
        <button onClick={mergeDocuments}>Download</button>
     
     <div className="App">
       <Viewer />
     </div>
   </WebViewerContext.Provider>
  );
}

export default App;
