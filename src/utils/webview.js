export function isRunningInWebview() {
    return window.isRunningInWebview;
}

export function sendEventToWebview(type, content = null) {
    if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
        window.console.log(
            'Warning: undefined function window.ReactNativeWebView.postMessage'
        );
        return;
    }

    // Some event does not have value of content, so we send only event name
    const message = content !== null ? type + '::' + content : type;

    window.ReactNativeWebView.postMessage(message);
}
