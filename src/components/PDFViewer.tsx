"use client";

import {
  RenderPageProps,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";

import { useEffect } from "react";

type Props = {
  fileUrl: string;
};

const CustomPageLayer: React.FC<{
  renderPageProps: RenderPageProps;
}> = ({ renderPageProps }) => {
  useEffect(() => {
    // Mark the page rendered completely when the canvas layer is rendered completely
    // So the next page will be rendered
    if (renderPageProps.canvasLayerRendered) {
      renderPageProps.markRendered(renderPageProps.pageIndex);
    }
  }, [renderPageProps.canvasLayerRendered]);

  return <>{renderPageProps.canvasLayer.children}</>;
};

const renderPage = (props: RenderPageProps) => (
  <CustomPageLayer renderPageProps={props} />
);

const PdfViewer = ({ fileUrl }: Props) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div>
        <Viewer renderPage={renderPage} fileUrl={fileUrl} />
      </div>
    </Worker>
  );
};

export default PdfViewer;
