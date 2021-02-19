'use strict';

const DeviceInfo = async(req, res, next) => {
    // console.log('req.device');
    // console.log(req.device);
    // console.log('req.device');

    req.deviceInfo = { type: req.device.type };

    next();
}

module.exports = DeviceInfo;