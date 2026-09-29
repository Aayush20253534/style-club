# Style Club mystery boxes: Blender + React Three Fiber

The website displays four transparent product renders from `public/gift-renders` as the default experience. Keep these assets in Git; a missing image leaves an empty card. The Blender script creates four distinct GLB models, one for each spending tier. When all four are available, visitors can choose **Explore in 3D**; the site then loads them in one canvas. The gift contents remain hidden.

## Windows setup

In PowerShell:

```powershell
winget install -e --id BlenderFoundation.Blender
```

Restart PowerShell after installation. If `blender --version` is not recognized, find `blender.exe` in `C:\Program Files\Blender Foundation` and use its full path as `$blender` below. If the installer fails, the portable ZIP from https://www.blender.org/download/ can be unpacked under `$env:LOCALAPPDATA\Programs\Blender`; set `$blender` to the full path of its `blender.exe`.

From the repository root:

```powershell
$blender = (Get-Command blender -ErrorAction SilentlyContinue).Source
if (-not $blender) {
  $blender = (Get-ChildItem 'C:\Program Files\Blender Foundation' -Filter blender.exe -Recurse | Select-Object -Last 1 -ExpandProperty FullName)
}
& $blender --background --python .\scripts\build_mystery_box.py -- .\public\models\style-club-mystery-box.glb .\media\style-club-mystery-box.blend
npm ci
npm run dev
```

If you have already installed the portable Blender 5.2.1 ZIP, set `$blender = "$env:LOCALAPPDATA\Programs\Blender\blender-5.2.1-windows-x64\blender.exe"` instead of running the discovery block. If `npm ci` reports `EPERM` for a native module, stop the running dev server and retry after Windows releases the file lock.

Open http://localhost:3000. The paths passed to Blender are filename stems. The command writes these four runtime assets under `public/models` and four editable `.blend` files under `media`:

| Tier | Model | Design |
| --- | --- | --- |
| ₹2,500+ | `style-club-mystery-box-2500.glb` | Compact sapphire box with gold edge piping and round seal |
| ₹5,000+ | `style-club-mystery-box-5000.glb` | Tall copper box with inset panel and hexagonal seal |
| ₹7,500+ | `style-club-mystery-box-7500.glb` | Wide plum chest with double straps, corner trim, and octagonal seal |
| ₹10,000+ | `style-club-mystery-box-10000.glb` | Tall ivory and gold box with double inset frames and crown detailing |

The four GLB files must be kept in the repository when publishing. The `.blend` files are useful for further editing, but are not needed at runtime. A previously generated unsuffixed `style-club-mystery-box.glb` is no longer used by the site.

Each model uses a `GiftLid` pivot. Keep that name if you edit a box, because the site rotates it to open the lid. The generated bow is a sculpted ribbon mesh with piping, and each box has an empty, dark lined interior. The renders are visual targets; procedural geometry and real-time glTF materials will not reproduce every photographic fabric fold or highlight exactly. The artwork stays visible by default, with tilt, lift, and a click effect. The optional 3D view adds hover movement and a spring driven lid opening on click. Motion pauses when out of view and respects reduced-motion settings.

Before publishing, run `npm run release:verify` and test desktop, mobile, and keyboard access. If any GLB is missing, all four product render fallbacks remain visible.
