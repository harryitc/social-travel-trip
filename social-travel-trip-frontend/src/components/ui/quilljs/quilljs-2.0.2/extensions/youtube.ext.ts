import { IframeApiType, load_youtube_iframe_api, PlayerStates, PlayerType } from "youtube_iframe_api_loader"

class QuilljsYoutubeHelper {
    /**
     * Hide Related videos when the video ended
     * --> When the video END ===> stopVideo()
     * @param iframe 
     */
    static hideRelatedVideos = async (iframe: HTMLIFrameElement) => {
        ///VIDEO ID
        const videoId: string = iframe.getAttribute("id") || ''
        if (!videoId) {
            return;
        }
        const k_data = "data-set-player"
        ///Check job done
        if (iframe.getAttribute(k_data)) {
            return;
        }
        ///YT
        const YT: IframeApiType = await load_youtube_iframe_api()
        let player: PlayerType;
        //Handlers
        const playerReadyHandler = (e: any) => {
            console.log(`Video ${videoId} READY!`)
        }
        const playerStateChangeHandler = (e: any) => {
            const player: PlayerType = e.target
            const playerState = e.data
            if (playerState === PlayerStates.ENDED) {
                player.stopVideo()
            }
        }
        player = new YT.Player(videoId, {
            videoId,
            events: {
                "onReady": playerReadyHandler,
                "onStateChange": playerStateChangeHandler,
            }
        })
        //Set data
        iframe.setAttribute(k_data, "1")
    }
}
//Export
export { QuilljsYoutubeHelper }