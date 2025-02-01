/**
 * Script for welcome.ejs
 */
const fs   = require('fs-extra')
const sysRoot = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const oldClientPath = path.join(sysRoot, '.nfclient-latest');
const currentClientPath = path.join(sysRoot, '.nfclient-fabric', 'instance');

document.getElementById('welcomeButton').addEventListener('click', e => {
    document.getElementById('welcomeButton').disabled = true;
    if (fs.existsSync(path.join(oldClientPath, 'uninst.exe'))) {
        setOverlayContent(
            Lang.queryJS('migration.title'),
            Lang.queryJS('migration.message'),
            Lang.queryJS('migration.confirmButton'),
            Lang.queryJS('migration.cancelButton')
        )
        setOverlayHandler(() => {
            toggleOverlay(false)
            migration();
        })
        setDismissHandler(() => {
            toggleOverlay(false)
            endWelcome();
        })
        toggleOverlay(true, true)
    } else {
        endWelcome();
    }
})

function migration() {
    const files = [
        'servers.dat',
        'hotbar.nbt',
        'commandblockide.bin',
        'command_history.txt',
        'saves',
        'resourcepacks',
        'shaderpacks',
        'screenshots',
        'config',
        'replay_recordings'
    ]
    copyRootFiles(files);
}

function copyRootFiles(files) {
    try {
        for (const source of files) {
            const org = path.join(oldClientPath, source);
            const destination = path.join(currentClientPath, source);

            if (fs.existsSync(org)) {
                fs.copy(org, destination);
                console.log(`${org} 복사 완료`);
            } else {
                console.warn(`${org} 파일이 존재하지 않음`);
            }
        }
        console.log('모든 파일 복사 완료');
        endWelcome();
      } catch (err) {
        console.error('파일 복사 실패:', err);
        setOverlayContent(
            Lang.queryJS('가져오기 실패!'),
            Lang.queryJS('가져오기를 실패힜습니다.'),
            Lang.queryJS('다시 시도'),
            Lang.queryJS('취소')
        )
        setOverlayHandler(() => {
            toggleOverlay(false)
            migration();
        })
        setDismissHandler(() => {
            toggleOverlay(false)
            endWelcome();
        })
        toggleOverlay(true, true)
      }
}

function endWelcome() {
    loginOptionsCancelEnabled(false) // False by default, be explicit.
    loginOptionsViewOnLoginSuccess = VIEWS.landing
    loginOptionsViewOnLoginCancel = VIEWS.loginOptions
    switchView(VIEWS.welcome, VIEWS.loginOptions)
}