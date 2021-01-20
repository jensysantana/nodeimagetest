'use strict'

class ImageProcessing {
    homes(req, res) {

        return res.status(200).json({
            response: res.image,
        })
    }
}