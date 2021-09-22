import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  standardWidth: number = 572;
  standardHeight: number = 360;
  standardQuality: number = 1;

  constructor() { }

  convertFileToJpegBase64(file: File, callback: Function, errCallback: Function){
    if (file.type.split("/")[0] !== "image"){
      return errCallback("File has no Image type!");
    }
    // read FileData
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      // convert File to Image Object
      let img = new Image();
      img.onload = () => {
        // create temporary invisible canvas in DOM
        var cvs = document.createElement('canvas');
        cvs.width = this.standardWidth;
        cvs.height = this.standardHeight;
        // draw image on canvas and resize to standard values
        cvs.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, this.standardWidth, this.standardHeight);
        // convert to JPEG
        var newImageData = cvs.toDataURL("image/jpeg", this.standardQuality);
        console.log(newImageData)
        callback(newImageData)
      }
      img.src = event.target.result;
    };
    reader.onerror = (event: any) => {
      errCallback("File could not be read: " + event.target.error.code);
    };
  }

  getPlaceholderImage(){
    return "/assets/placeholderImage.jpg";
  }
}
