"use client"

import React from "react";
import ImageGallery from "react-image-gallery";
// import PlaceHolderImage from "../../../../assets/placeholder.jpg"

export default function SVImageGallery({ imageList }:any) {
  const images:any = [];

  console.log("img from sb", imageList)
  imageList?.forEach((image:any) => {
    const img = {
      original: image.img,
      thumbnail: image.img,
     };
    images.push(img);
  });

  return (
    <div className="w-full">
      {images?.length !== 0 ? (
        <ImageGallery
        //   onErrorImageURL={PlaceHolderImage}
          onClick={(event:any) => {
            const clickedImageSrc = event.target.getAttribute("src");
            console.log("Clicked image src:", clickedImageSrc);
          }}
          indexSeparator="false"
          showNav={false}
          autoPlay={true}
          items={images}
          lazyLoad
          useTranslate3D
          // useBrowserFullscreen={false}
          showPlayButton={false}
          showFullscreenButton={true}
        />
      ) : (
        <div
          style={{
            height: "410px",
            border: "1px dashed lightgray",
            padding: "26px",
            borderRadius: "5px",
            display: "grid",
            placeItems: "center",
            width:"100%"
            // textAlign: "center",
          }}
        >
          <h4 style={{color:"lightgray", fontWeight:600}}>No image found</h4>
        </div>
      )}
    </div>
  );
}
