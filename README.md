# hither and dither
pursue your pixelated dreams! a full-stack web app made with react, typescript, tailwind, and the PIL image library in python. uses a RESTful API (flask for local dev, aws lambda + api gateway in production) to receive formdata, store images, and deliver dithered images.

![hither and dither promotional banner, containing dithered imagery of famous artwork](/assets/image.png)

## screenshots
![main menu for hither and dither. consists of inputs that let you change the dithering algorithm, colour palette, brightness, contrast, and export resolution and scale](assets/image-1.png)
![loading screen for hither and dither. currently at the stage of "uploading 4 images"](assets/image-2.png)
![final menu for hither and dither. shows a preview of the dithered images in front of a pixelated zip file icon. below is the text "your images are ready, have a splendid day!" and a button to download the dithered images.](assets/image-3.png)

## architecture
![AWS architecture diagram for the project. consists of cloudfront hooked up to an s3 bucket (built via codepipeline) and a serverless api using api gateway, lambda, and s3](/assets/architecture.png)

## next steps
this project has taken quite some time! it would have honestly taken more had i not minimized the scope over the course of making hither and dither. here's just a future ideas list to let me know where i can pick things back up again.

- [ ] custom algorithm interface (allow users to create their own weight matrices)
- [ ] implement better api auth! JWT or implementation with cognito (still need to figure out how this works)
- [ ] save user generations in some sort of SQL database + file storage solution (aurora dsql + s3 seems to be the cheapest and most effective), and retrieve past generations on pageload
- [ ] add disclaimer if loading is taking a long time (specifically for ordered dithering, which is known to take a long time)

---
thanks for checking out this project!