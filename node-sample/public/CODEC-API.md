# JavaScript SDK for AT&T Enhanced WebRTC

## API for Audio Codecs

#### ATT.rtc.getSupportedAudioCodecs

* Returns a list of supported Audio Codecs.

` ATT.rtc.getSupportedAudioCodecs()  //returns: ["opus", "G722", "PCMU", "PCMA"] `

#### ATT.rtc.setAudioCodec

* Sets a supported audio codec to use for any subsequent calls in the current browser session. Values passed in are case insensitive.
* Throws an error if the value passed in is not in the supported codec list.

` ATT.rtc.setAudioCodec('pcmu') `

`ATT.rtc.setAudioCodec('foo') // Throws: Invalid audioCodec provided. Please use one of these options: opus, G722, PCMU, PCMA `

#### ATT.rtc.getAudioCodec

* Returns the supported audio codec that has been set using `ATT.rtc.setAudioCodec` or `null`. Values returned are in the same case as those passed in to `ATT.rtc.setAudioCodec`.

` ATT.rtc.getAudioCodec() // returns "pcmu" `

#### ATT.rtc.resetAudioCodec

* Resets the previously set audio codec to `null` and will result in the SDK using the browser generated audio codecs for any subsequent calls.

` ATT.rtc.resetAudioCodec() `
