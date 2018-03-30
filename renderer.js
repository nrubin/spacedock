// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote;
const qs = require('qs')
const parse = require('url').parse
const axios = require('axios')


const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me'
const GOOGLE_CLIENT_ID = '867624152894-p6h7mm8iji1drehq0b26m319i1k97uhp.apps.googleusercontent.com'
const GOOGLE_REDIRECT_URI = 'com.googleusercontent.apps.867624152894-p6h7mm8iji1drehq0b26m319i1k97uhp:/oauth2redirect'
const GOOGLE_FILE_URL ='https://www.googleapis.com/drive/v3/files'


 function signInWithPopup () {
    return new Promise((resolve, reject) => {
      const authWindow = new remote.BrowserWindow({
        width: 500,
        height: 600,
        show: true,
      })
  
      // TODO: Generate and validate PKCE code_challenge value
      const urlParams = {
        response_type: 'code',
        redirect_uri: GOOGLE_REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        scope: 'profile email https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata  https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly',
      }
      const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`
  
      function handleNavigation (url) {
        const query = parse(url, true).query
        if (query) {
          if (query.error) {
            reject(new Error(`There was an error: ${query.error}`))
          } else if (query.code) {
            // Login is complete
            authWindow.removeAllListeners('closed')
            setImmediate(() => authWindow.close())
    
            // This is the authorization code we need to request tokens
            resolve(query.code)
          }
        }
      }
  
      authWindow.on('closed', () => {
        // TODO: Handle this smoothly
        throw new Error('Auth window was closed by user')
      })
  
      authWindow.webContents.on('will-navigate', (event, url) => {
        handleNavigation(url)
      })
  
      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        handleNavigation(newUrl)
      })
  
      authWindow.loadURL(authUrl)
    })
  }

   async function fetchAccessTokens (code) {
    const response = await axios.post(GOOGLE_TOKEN_URL, qs.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  }

   async function fetchGoogleProfile (accessToken) {
    const response = await axios.get(GOOGLE_PROFILE_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    return response.data
  }
  
async function getAllDocuments(accessToken){
    const q = "mimeType contains 'document'"
    const response = await axios.get(GOOGLE_FILE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        params :{
            // corpora:'user,domain',
            q: q,
            // orderBy: 'viewedByMeTime',
            // spaces: 'drive'
        },
    })
    return response.data
}

function mySignInFunction (auser){
    console.log(auser)
}

async function googleSignIn () {
    const code = await signInWithPopup()
    const tokens = await fetchAccessTokens(code)
    const {id, email, name} = await fetchGoogleProfile(tokens.access_token)
    const filelistdata = await getAllDocuments(tokens.access_token)
    return mySignInFunction(filelistdata)
    // const providerUser = {
    //   uid: id,
    //   email,
    //   displayName: name,
    //   idToken: tokens.id_token,
    // }
    // return mySignInFunction(providerUser)
}

document.getElementById("thefirst").addEventListener("click",function(){
  console.log(view);
  view.loadURL("https://docs.google.com/document/d/1WunfEMZggq8TNCSjbsGNtZD6du3szuHfMjk7YoGQu9E/edit")
});
document.getElementById("thesecond").addEventListener("click",function(){view.loadURL("https://docs.google.com/document/d/1g6aPGpLDKrWlN7lEsnUSUQwNSWapAD2_kBxFIFXdkpo/edit")});
document.getElementById("thethird").addEventListener("click",function(){view.loadURL("https://docs.google.com/document/d/1Iyq1yIgca1VrcjW8rj_QL4SRLF193ApoLS6MVOqN-7s/edit")});
document.getElementById("dev").addEventListener("click",function(){
    remote.getCurrentWindow().toggleDevTools();
});

googleSignIn()





// To Do / Continue 
// Feedback when loading
// Feedback with favorite icon to show that bookmark is not-added/added/already-added
// Tabs !:@
// Option to remove bookmarks.  