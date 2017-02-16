/**
 * Created by Administrator on 2017/1/9.
 */
//--------------- FFMPEG command line
ffmpeg = child_process.spawn("ffmpeg", [
    "-i", rtsp , "-vcodec", "copy", "-f", "mp4", "-f", "segment", "-segment_time", recSeg, "-segment_wrap", 2, "-map", "0", "-segment_format", "mp4", "-reset_timestamps", "1", "-y", "plugins/security/videos/" + camName + "/rec-%01d.mp4"
],  {detached: false});

//---------------- Node.JS streamer
// Stream mp4 video file based on URL request from client player. Accept request for partial streams
// Code attribution: https://github.com/meloncholy/vid-streamer/blob/master/index.js (MIT license)
var recStream = function (req, resp) {
    var stream;
    var stat;
    //var rootFolder = "videos/";
    var rootFolder = "";
    var info = {};
    var range = typeof req.headers.range === "string" ? req.headers.range : undefined;
    var reqUrl = url.parse(req.url, true);

    info.path = typeof reqUrl.pathname === "string" ? reqUrl.pathname.substring(1) : undefined;
    if (info.path) {
        try {
            info.path = decodeURIComponent(info.path);
        } catch (exception) {
            console.log("Video Streamer bad request received - " + resp);         // Can throw URI malformed exception.
            return false;
        }
    }

    info.file = info.path.match(/(.*[\/|\\])?(.+?)$/)[2];
    info.path = rootFolder + info.path;

    try {
        stat = fs.statSync(info.path);
        if (!stat.isFile()) {
            console.log("Video Streamer bad file specified - " + resp);
            return false;
        }
    } catch (e) {
        console.log("Video Streamer bad file specified - " + resp + " " + e);
        return false;
    }

    info.start = 0;
    info.end = stat.size - 1;
    info.size = stat.size;
    info.modified = stat.mtime;
    info.rangeRequest = false;
    info.maxAge = "3600"
    info.server = info.file
    info.mime = "video/mp4"

    if (range !== undefined && (range = range.match(/bytes=(.+)-(.+)?/)) !== null) {
        // Check range contains numbers and they fit in the file. Make sure info.start & info.end are numbers (not strings) or stream.pipe errors out if start > 0.
        info.start = isNumber(range[1]) && range[1] >= 0 && range[1] < info.end ? range[1] - 0 : info.start;
        info.end = isNumber(range[2]) && range[2] > info.start && range[2] <= info.end ? range[2] - 0 : info.end;
        info.rangeRequest = true;
    } else if (reqUrl.query.start || reqUrl.query.end) {
        // This is a range request, but doesn't get range headers.
        info.start = isNumber(reqUrl.query.start) && reqUrl.query.start >= 0 && reqUrl.query.start < info.end ? reqUrl.query.start - 0 : info.start;
        info.end = isNumber(reqUrl.query.end) && reqUrl.query.end > info.start && reqUrl.query.end <= info.end ? reqUrl.query.end - 0 : info.end;
    }

    info.length = info.end - info.start + 1;

    var code = 200;
    var header = {
        "Cache-Control": "public; max-age=" + info.maxAge,
        Connection: "keep-alive",
        "Content-Type": info.mime,
        "Content-Disposition": "inline; filename=" + info.file + ";"
    };

    if (info.rangeRequest) {                // Partial http response
        code = 206;
        header.Status = "206 Partial Content";
        header["Accept-Ranges"] = "bytes";
        header["Content-Range"] = "bytes " + info.start + "-" + info.end + "/" + info.size;
    }

    header.Pragma = "public";
    header["Last-Modified"] = info.modified.toUTCString();
    header["Content-Transfer-Encoding"] = "binary";
    header["Content-Length"] = info.length;
    header.Server = info.server;

    resp.writeHead(code, header);

    stream = fs.createReadStream(info.path, { flags: "r", start: info.start, end: info.end });
    stream.pipe(resp);
    return true;
};

var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);        // http://stackoverflow.com/a/1830844/648802
};