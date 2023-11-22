# cloudinary-purge

I love Cloudinary and often use its free account as an image proxy. The free
account has a limit on the storage capacity for source images.

Once, I had a badly configured script that uploaded raw (uncompressed) images,
and asked Cloudinary to serve them. It filled my storage capacity in a few
hours.

This repository contains the code I used to purge my whole Cloudinary account
from any image stored, forcing it to re-download them (I had in the meantime
updated and compressed the images).

To use:
- Define ENV variables in a `.envrc` file
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Run with `yarn run run`

It will fetch all images and delete them, by batches of 100 at a time. Note that
the default hourly rate limit is 500, so you might have to run the script
several times, at different hours, to empty large accounts.

There is a display glitch that doesn't correctly display the number of processed
elements, but it does delete everthing.
