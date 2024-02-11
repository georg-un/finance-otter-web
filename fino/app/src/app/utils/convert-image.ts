import { shareReplay, Subject } from 'rxjs';

export const convertImageToDataUrl = (img: Blob) => {
  const encodedImage = new Subject<string | ArrayBuffer | null>();
  if (img && img.size > 32) {
    const reader = new FileReader();
    reader.onloadend = () => {
      encodedImage.next(reader.result);
      encodedImage.complete();
    };
    reader.readAsDataURL(img);
  } else {
    encodedImage.next(null);
    encodedImage.complete();
  }
  return encodedImage.asObservable().pipe(shareReplay(1));
}
