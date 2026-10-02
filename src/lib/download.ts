/**
 * Opens a short-lived download link that has to be fetched first. The tab is opened
 * synchronously inside the click so mobile browsers do not treat it as a blocked popup;
 * if it is blocked anyway we fall back to navigating the current tab.
 */
export async function openFetchedLink(fetchUrl: () => Promise<string>): Promise<void> {
  const tab = window.open("", "_blank");
  try {
    const url = await fetchUrl();
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.assign(url);
    }
  } catch (error) {
    tab?.close();
    throw error;
  }
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
