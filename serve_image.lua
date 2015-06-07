-- Ресайз изображений и кеширование результата

local magick = require("magick")
local root, size, name, f_dir, s_dir = '/home/www/tz/img/', ngx.var.size, ngx.var.name, ngx.var.f_dir, ngx.var.s_dir
local source_fname = root..'/full/'..f_dir..'/'..s_dir..'/'..f_dir..s_dir..name..'.jpg'
local dest_fname = root..'/'..size..'/'..f_dir..'/'..s_dir..'/'..f_dir..s_dir..name..'.jpg'

function string:split( inSplitPattern, outResults )
    if not outResults then
        outResults = { }
    end
    local theStart = 1
    local theSplitStart, theSplitEnd = string.find( self, inSplitPattern, theStart )
    while theSplitStart do
        table.insert( outResults, string.sub( self, theStart, theSplitStart-1 ) )
        theStart = theSplitEnd + 1
        theSplitStart, theSplitEnd = string.find( self, inSplitPattern, theStart )
    end
    table.insert( outResults, string.sub( self, theStart ) )
    return outResults
end

local function return_not_found(msg)
  ngx.status = ngx.HTTP_NOT_FOUND
  ngx.header["Content-type"] = "text/html"
  ngx.say(msg or "file not found")
  ngx.exit(0)
end

local allowable_size = false
local allowable_sizes = {'180x135','320x240','500x375','640x480'}

for _,v in pairs(allowable_sizes) do
  if v == size then
        allowable_size = true
    break
  end
end

if not allowable_size then
    return_not_found('bar request')
end

local lfs = require("lfs")

lfs.mkdir(root..size)

lfs.mkdir(root..size..'/'..f_dir)

lfs.mkdir(root..size..'/'..f_dir..'/'..s_dir)

local file = io.open(source_fname)

if not file then
  return_not_found()
end

local t = size:split("x")
local uW, uH = tonumber(t[1]) , tonumber(t[2])
local dst_img = assert(magick.load_image(source_fname))

dst_img:resize_and_crop(uW,uH)
dst_img:set_quality(75)
dst_img:strip()
dst_img:write(dest_fname)
dst_img:destroy()

ngx.header["x-bender-test"] = "gen"
ngx.exec(ngx.var.request_uri)