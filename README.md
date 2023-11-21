# cloudinary-purge

I love Cloudinary and often use its free account as an image proxy. The free
account has a limit on the storage capacity for source images.

Once, I had a badly configured script that uploaded raw (uncompressed) images,
and asked Cloudinary to serve them. It filled my storage capacity in a few
hours.

This repository contains the code I used to purge my whole Cloudinary account
from any image stored, forcing it to re-download them (I had in the meantime
updated and compressed the images).
