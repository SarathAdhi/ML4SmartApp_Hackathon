import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import PizZipUtils from "pizzip/utils";
import PageLayout from "@layouts/PageLayout";

interface LoadFileProps {
  url: string;
  callback: (error: Error, data: string) => void;
}

function loadFile(
  url: LoadFileProps["url"],
  callback: LoadFileProps["callback"]
) {
  PizZipUtils.getBinaryContent(url, callback);
}

function Home() {
  const generateDocument = () => {
    loadFile("output.docx", function (error: Error, content: string) {
      if (error) {
        throw error;
      }

      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.setData({
        first_name: "John",
        last_name: "Doe",
        phone: "0652455478",
        description: "New Website",
      });
      try {
        doc.render();
      } catch (error) {}

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, "output.docx");
    });
  };

  return (
    <PageLayout>
      <input type="file" onChange={() => {}} />
      <button onClick={generateDocument}>Download</button>
    </PageLayout>
  );
}

export default Home;
