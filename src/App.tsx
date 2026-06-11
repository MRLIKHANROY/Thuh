/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  Palette,
  Layers,
  Camera,
  Layers2,
  FileCode,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Sliders,
  Maximize2,
  Info,
  Layers3,
  HelpCircle,
  FileJson,
  Upload,
  Undo
} from 'lucide-react';

// --- Default Layer Names for LayerMask Tool ---
const DEFAULT_UNITY_LAYERS = [
  { id: 0, name: 'Default', active: true },
  { id: 1, name: 'TransparentFX', active: false },
  { id: 2, name: 'Ignore Raycast', active: false },
  { id: 3, name: 'Built-in 3', active: false },
  { id: 4, name: 'Water', active: false },
  { id: 5, name: 'UI', active: false },
  { id: 6, name: 'Built-in 6', active: false },
  { id: 7, name: 'Built-in 7', active: false },
  { id: 8, name: 'Player', active: true },
  { id: 9, name: 'Enemy', active: true },
  { id: 10, name: 'Ground', active: true },
  { id: 11, name: 'Obstacle', active: false },
  { id: 12, name: 'Interactive', active: false },
  { id: 13, name: 'PostProcessing', active: false },
  { id: 14, name: 'Layer 14', active: false },
  { id: 15, name: 'Layer 15', active: false },
  { id: 16, name: 'Layer 16', active: false },
  { id: 17, name: 'Layer 17', active: false },
  { id: 18, name: 'Layer 18', active: false },
  { id: 19, name: 'Layer 19', active: false },
  { id: 20, name: 'Layer 20', active: false },
  { id: 21, name: 'Layer 21', active: false },
  { id: 22, name: 'Layer 22', active: false },
  { id: 23, name: 'Layer 23', active: false },
  { id: 24, name: 'Layer 24', active: false },
  { id: 25, name: 'Layer 25', active: false },
  { id: 26, name: 'Layer 26', active: false },
  { id: 27, name: 'Layer 27', active: false },
  { id: 28, name: 'Layer 28', active: false },
  { id: 29, name: 'Layer 29', active: false },
  { id: 30, name: 'Layer 30', active: false },
  { id: 31, name: 'Layer 31', active: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'script' | 'palette' | 'layermask' | 'camera' | 'json' | 'asmdef'>('script');

  // --- Common Copy to Clipboard Notice state ---
  const [copiedText, setCopiedText] = useState<'script' | 'usage' | 'layers_csharp' | 'palette_cs' | 'palette_cs32' | 'palette_hsv' | 'camera_cs' | 'json_cs' | 'asmdef_json' | null>(null);

  const handleCopy = (text: string, identifier: any) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // =========================================================================
  // TOOL 1: AI C# Script Architect State & Logic
  // =========================================================================
  const [aiPrompt, setAiPrompt] = useState('Build a clean Object Pool system for spawning bullets in 3D. Must recycle bullets once disabled and have a pre-warm option configured from the inspector.');
  const [scriptType, setScriptType] = useState('Gameplay Utilities');
  const [scriptComplexity, setScriptComplexity] = useState('Clean & Optimized');
  const [scriptComments, setScriptComments] = useState(true);
  const [highPerformanceMode, setHighPerformanceMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedData, setGeneratedData] = useState<{
    className: string;
    scriptCode: string;
    usageDescription: string;
  }>({
    className: 'BulletPooler',
    scriptCode: `using System.Collections.Generic;
using UnityEngine;

namespace Core.Gameplay
{
    [Tooltip("Robust object pooling utility to prevent high allocation overhead at runtime.")]
    public class BulletPooler : MonoBehaviour
    {
        public static BulletPooler Instance { get; private set; }

        [Header("Pool Configurations")]
        [SerializeField, Tooltip("Prefab to clone in the pool")]
        private GameObject _bulletPrefab;

        [SerializeField, Tooltip("Initial pre-warm quantity on start")]
        private int _prewarmAmount = 25;

        [SerializeField, Tooltip("Should pool dynamically expand when depleted?")]
        private bool _allowExpansion = true;

        private readonly Queue<GameObject> _pooledObjects = new Queue<GameObject>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            Prewarm();
        }

        private void Prewarm()
        {
            for (int i = 0; i < _prewarmAmount; i++)
            {
                CreateNewPoolItem();
            }
        }

        private GameObject CreateNewPoolItem()
        {
            GameObject obj = Instantiate(_bulletPrefab, transform);
            obj.SetActive(false);
            _pooledObjects.Enqueue(obj);
            return obj;
        }

        /// <summary>
        /// Retrieves an available object from pool or generates expansion item.
        /// </summary>
        public GameObject GetPooledObject(Vector3 position, Quaternion rotation)
        {
            if (_pooledObjects.Count == 0)
            {
                if (_allowExpansion)
                {
                    GameObject newObj = CreateNewPoolItem();
                    newObj.SetActive(true);
                    newObj.transform.SetPositionAndRotation(position, rotation);
                    return newObj;
                }
                return null;
            }

            GameObject item = _pooledObjects.Dequeue();
            
            // In case the gameobject was destroyed externally
            while (item == null && _pooledObjects.Count > 0)
            {
                item = _pooledObjects.Dequeue();
            }

            if (item == null) return _allowExpansion ? CreateNewPoolItem() : null;

            item.transform.SetPositionAndRotation(position, rotation);
            item.SetActive(true);
            return item;
        }

        /// <summary>
        /// Recycles a bullet back into the inactive pool queue.
        /// </summary>
        public void ReturnToPool(GameObject bullet)
        {
            bullet.SetActive(false);
            _pooledObjects.Enqueue(bullet);
        }
    }
}`,
    usageDescription: "1. Create an empty GameObject in your Unity hierarchy and name it \"ObjectPooler\".\n2. Attach this custom BulletPooler script to the object.\n3. Assign your Bullet Prefab to the field in the inspector.\n4. From any firing script call: \n   GameObject bullet = BulletPooler.Instance.GetPooledObject(firePosition, fireRotation);"
  });

  // Prompt templates selection helper
  const scriptTemplates = [
    {
      title: "Bullet Object Pooler",
      prompt: "Build an object pooling system for spawning bullets. Must recycle bullets once disabled and support predefined pools.",
      type: "Gameplay Utilities",
    },
    {
      title: "Third Person Locomotion",
      prompt: "Create a 3D Character Controller with Rigidbody moving state. Include grounded detection raycast and custom input bindings.",
      type: "Movement & Physics",
    },
    {
      title: "Custom GUI Inspector",
      prompt: "Create a custom editor script rendering a serialized game manager with custom action buttons in the Unity inspector window.",
      type: "Editor Tooling",
    },
    {
      title: "Camera Shake Vector",
      prompt: "Generate a cinema-style camera shake script using noise curves (smooth lerps) without allocating garbage frame-over-frame.",
      type: "Visual Effects",
    },
    {
      title: "Weapon Raycast System",
      prompt: "Create a weapon script using Physics.Raycast with layer exclusions, damage broadcast callbacks, and muzzle flash instantiate recycler.",
      type: "Weapons & Attack",
    }
  ];

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: scriptType,
          complexity: scriptComplexity,
          includesComments: scriptComments,
          performanceMode: highPerformanceMode,
        }),
      });

      if (!res.ok) {
        throw new Error('Endpoint responded with error state.');
      }

      const data = await res.json();
      if (data.scriptCode) {
        setGeneratedData(data);
      } else {
        throw new Error('Response did not have standard script payload properties.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to call the server-side compiler. Please check your config parameters.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Simple custom interactive syntax highlither for C# so generated code looks gorgeous
  const renderCSharpHighlight = (codeText: string) => {
    const lines = codeText.split('\n');
    return lines.map((line, lineIdx) => {
      // Basic token replacers for colorings
      let formatted = line;

      // Escape HTML entities safely
      formatted = formatted
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Comments: starting with //
      if (formatted.trim().startsWith('//') || formatted.trim().startsWith('///')) {
        return (
          <div key={lineIdx} className="font-mono text-xs leading-5 text-emerald-500 italic">
            <span className="text-emerald-600/60 select-none mr-4 inline-block w-6 text-right font-light">{lineIdx + 1}</span>
            {line}
          </div>
        );
      }

      // Keywords highlights
      const keywords = [
        'using', 'namespace', 'public', 'private', 'class', 'struct', 'interface', 'static', 'readonly', 'return',
        'void', 'float', 'int', 'string', 'bool', 'var', 'new', 'if', 'else', 'for', 'foreach', 'while', 'null',
        'get', 'set', 'this', 'override', 'virtual', 'abstract', 'const', 'true', 'false', 'typeof', 'monobehaviour', 'MonoBehaviour'
      ];

      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        if (kw === 'SerializeField' || kw === 'Tooltip' || kw === 'Header') {
          formatted = formatted.replace(regex, `<span class="text-amber-400 font-semibold">$1</span>`);
        } else {
          // Identify system names
          formatted = formatted.replace(regex, `<span class="text-[#569cd6] font-medium">${kw}</span>`);
        }
      });

      // Serialized brackets highlight
      formatted = formatted.replace(/(\[SerializeField\]|\[Tooltip\(".*"\)\]|\[Header\(".*"\)\]|\[System\.Serializable\])/g, `<span class="text-yellow-503">$1</span>`);

      // String literals
      formatted = formatted.replace(/("[^"]*")/g, `<span class="text-[#ce9178]">$1</span>`);

      // Numbers
      formatted = formatted.replace(/\b(\d+f?|\d+\.\d+f?)\b/g, `<span class="text-[#b5cea8]">$1</span>`);

      // Method declarations, e.g. Awake(, Start(, etc
      formatted = formatted.replace(/\b(\w+)\s*(?=\()/g, `<span class="text-[#dcdcaa] font-semibold">$1</span>`);

      return (
        <div key={lineIdx} className="font-mono text-xs leading-5 text-[#d4d4d4] hover:bg-slate-800/30 transition-colors">
          <span className="text-slate-600 select-none mr-4 inline-block w-6 text-right font-light border-r border-slate-800/60 pr-2">{lineIdx + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      );
    });
  };

  // =========================================================================
  // TOOL 2: Color Palette Vector Exporter State & Logic
  // =========================================================================
  const [rgbColor, setRgbColor] = useState({ r: 0, g: 120, b: 212, a: 255 });
  const [paletteHexInput, setPaletteHexInput] = useState('#0078D4');
  const [tintFactor, setTintFactor] = useState(1.0);

  // Convert Hex to RGBA
  const hexToRgb = (hex: string) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(x => x + x).join('');
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return { r, g, b, a: 255 };
    }
    return null;
  };

  // Keep colors in sync
  useEffect(() => {
    const parsed = hexToRgb(paletteHexInput);
    if (parsed) {
      setRgbColor(prev => ({ ...prev, r: parsed.r, g: parsed.g, b: parsed.b }));
    }
  }, [paletteHexInput]);

  const handleSliderChange = (channel: 'r' | 'g' | 'b' | 'a', val: number) => {
    const updated = { ...rgbColor, [channel]: val };
    setRgbColor(updated);
    // Convert to Hex
    const rHex = updated.r.toString(16).padStart(2, '0');
    const gHex = updated.g.toString(16).padStart(2, '0');
    const bHex = updated.b.toString(16).padStart(2, '0');
    setPaletteHexInput(`#${rHex}${gHex}${bHex}`.toUpperCase());
  };

  // Calculated Unity floats (0.0f - 1.0f)
  const floatR = (Math.max(0, Math.min(255, rgbColor.r * tintFactor)) / 255).toFixed(3) + 'f';
  const floatG = (Math.max(0, Math.min(255, rgbColor.g * tintFactor)) / 255).toFixed(3) + 'f';
  const floatB = (Math.max(0, Math.min(255, rgbColor.b * tintFactor)) / 255).toFixed(3) + 'f';
  const floatA = (rgbColor.a / 255).toFixed(3) + 'f';

  // Math calculated colors for tinting
  const displayR = Math.round(Math.max(0, Math.min(255, rgbColor.r * tintFactor)));
  const displayG = Math.round(Math.max(0, Math.min(255, rgbColor.g * tintFactor)));
  const displayB = Math.round(Math.max(0, Math.min(255, rgbColor.b * tintFactor)));
  const displayA = rgbColor.a;

  // Code snippets for clipboard
  const colorCodeFloat = `new Color(${floatR}, ${floatG}, ${floatB}, ${floatA});`;
  const colorCode32 = `new Color32(${displayR}, ${displayG}, ${displayB}, ${displayA});`;

  // HSV representation
  const getHSV = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `new Vector3(${h.toFixed(3)}f, ${s.toFixed(3)}f, ${v.toFixed(3)}f) /* H:${Math.round(h*360)}° S:${Math.round(s*100)}% V:${Math.round(v*100)}% */`;
  };

  const unityPalettes = [
    { name: "Default Unity Blue", hex: "#0078D4" },
    { name: "Unity Dark gray", hex: "#2C2C2C" },
    { name: "Material Cyber Teal", hex: "#00E5FF" },
    { name: "Gold Coins XP", hex: "#FFD700" },
    { name: "Health Heart Red", hex: "#EF4444" },
    { name: "Mana Magic Blue", hex: "#3B82F6" },
    { name: "Stamina Energy Yellow", hex: "#F59E0B" },
    { name: "Sci-Fi Laser Neon Green", hex: "#10B981" }
  ];


  // =========================================================================
  // TOOL 3: Physics LayerMask Bitwise Logic State & Calculator
  // =========================================================================
  const [layers, setLayers] = useState(DEFAULT_UNITY_LAYERS);
  const [customLayerName, setCustomLayerName] = useState('');
  const [selectedLayerId, setSelectedLayerId] = useState<number>(12);

  const toggleLayerActive = (id: number) => {
    setLayers(prev => prev.map(lyr => lyr.id === id ? { ...lyr, active: !lyr.active } : lyr));
  };

  const handleUpdateLayerName = (id: number, name: string) => {
    setLayers(prev => prev.map(lyr => lyr.id === id ? { ...lyr, name: name } : lyr));
  };

  // Compute Mask value
  const totalMaskValue = layers.reduce((acc, lyr) => {
    if (lyr.active) {
      return acc + (1 << lyr.id);
    }
    return acc;
  }, 0);

  // Binary representations string (32-bit spaced)
  const getBinaryString = (val: number) => {
    let str = '';
    // Since bit shift in JS is 32-bit signed, let's treat unsigned
    const unsignedVal = val >>> 0;
    for (let i = 31; i >= 0; i--) {
      str += ((unsignedVal & (1 << i)) ? '1' : '0');
      if (i % 8 === 0 && i !== 0) {
        str += ' ';
      }
    }
    return str;
  };

  // Generate LayerMask C# setup snippet
  const getLayerMaskCSharpCode = () => {
    const activeLayers = layers.filter(l => l.active);
    if (activeLayers.length === 0) return `// No layers selected - Mask: 0\nLayerMask mask = 0;`;

    let explanationLines = activeLayers.map(l => `// Layer ${l.id}: ${l.name}`).join('\n');
    let binaryCombos = activeLayers.map(l => `(1 << ${l.id})`).join(' | ');

    return `${explanationLines}
// Aggregate Dec: ${totalMaskValue} | Bitwise representation
LayerMask myCollisionMask = ${binaryCombos || '0'};

// Check if raw gameObject layer is within specified layermask
void OnCollisionEnter(Collision collision)
{
    if ((myCollisionMask.value & (1 << collision.gameObject.layer)) != 0)
    {
        Debug.Log($"Hit targets: {collision.gameObject.name} in Layer: {LayerMask.LayerToName(collision.gameObject.layer)}");
    }
}

// Raycasting targeting active layers only
void RaycastTarget()
{
    if (Physics.Raycast(transform.position, transform.forward, out RaycastHit hit, 100f, myCollisionMask))
    {
        Debug.DrawRay(transform.position, transform.forward * hit.distance, Color.green);
    }
}`;
  };


  // =========================================================================
  // TOOL 4: Camera Resolution & Pixel-Perfect size Calculator State & Logic
  // =========================================================================
  const [targetWidth, setTargetWidth] = useState(1920);
  const [targetHeight, setTargetHeight] = useState(1080);
  const [pixelsPerUnit, setPixelsPerUnit] = useState(16);
  const [orthoScale, setOrthoScale] = useState(1.0); // e.g. zoom scale

  // 3D FOV converters state
  const [angleInput, setAngleInput] = useState(60);
  const [isVerticalInput, setIsVerticalInput] = useState(true); // input is V-FOV vs H-FOV
  const [cameraAspectWidth, setCameraAspectWidth] = useState(16);
  const [cameraAspectHeight, setCameraAspectHeight] = useState(9);

  // Orthographic size calculation
  // Unity ortho formula: Camera Ortho Size = screen_height / (2 * PPU)
  const calculatedOrthoSize = (targetHeight / (2 * pixelsPerUnit)) * orthoScale;

  const aspectFactor = targetWidth / targetHeight;

  // Horizontal viewport size block
  const viewportWidthInUnits = (calculatedOrthoSize * 2) * aspectFactor;
  const viewportHeightInUnits = calculatedOrthoSize * 2;

  // 3D FOV Conversion Logic
  // Aspect ratio
  const currentAspect = cameraAspectWidth / cameraAspectHeight;
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  let calculatedHorizontalFov = 0;
  let calculatedVerticalFov = 0;

  if (isVerticalInput) {
    calculatedVerticalFov = angleInput;
    // H_FOV = 2 * atan(tan(V_FOV/2) * AspectRatio)
    calculatedHorizontalFov = 2 * rad2deg * Math.atan(Math.tan((angleInput * deg2rad) / 2) * currentAspect);
  } else {
    calculatedHorizontalFov = angleInput;
    // V_FOV = 2 * atan(tan(H_FOV/2) / AspectRatio)
    calculatedVerticalFov = 2 * rad2deg * Math.atan(Math.tan((angleInput * deg2rad) / 2) / currentAspect);
  }

  // Camera Helper C# Generator
  const getCameraMathCSharp = () => {
    return `using UnityEngine;

[RequireComponent(typeof(Camera))]
public class CameraViewportCalibrator : MonoBehaviour
  {
      [Header("Desired Resolution Configurations")]
      [SerializeField] private int targetHeight = ${targetHeight};
      [SerializeField] private int ppu = ${pixelsPerUnit};

      private Camera _cam;

      private void Awake()
      {
          _cam = GetComponent<Camera>();
          CalibrateView();
      }

      [ContextMenu("Calibrate Now")]
      public void CalibrateView()
      {
          if (_cam == null) _cam = GetComponent<Camera>();

          if (_cam.orthographic)
          {
              // calculated camera size to perfectly align pixel sprites
              float computedSize = (float)targetHeight / (2f * ppu);
              _cam.orthographicSize = computedSize;
              Debug.Log($"Pixel Perfect setup completed successfully! Camera orthographicSize adjusted to: {computedSize}");
          }
          else
          {
              // 3D FOV setting based vertical/horizontal standards
              _cam.fieldOfView = ${calculatedVerticalFov.toFixed(1)}f;
              Debug.Log($"3D Camera FOV calibrated to target aspect ratio parameters");
          }
      }
  }`;
  };


  // =========================================================================
  // TOOL 5: JSON-to-Serializable Class Converter State & Logic
  // =========================================================================
  const [jsonInput, setJsonInput] = useState(`{
  "weaponId": "wpn_laser_09",
  "baseDamage": 45.5,
  "magazineCapacity": 30,
  "infiniteAmmo": false,
  "upgradeLevels": [1, 2, 3, 4],
  "elementalType": "Plasma",
  "firingOffsets": {
    "x": 0.05,
    "y": -0.1,
    "z": 1.2
  }
}`);
  const [csharpClassPrefix, setCsharpClassPrefix] = useState('WeaponStats');
  const [useEncapsulation, setUseEncapsulation] = useState(true);
  const [generatedClassesText, setGeneratedClassesText] = useState('');

  // Recursive parser to build serializable structures
  const convertJsonToCSharp = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      let outputCode = `using UnityEngine;\nusing System.Collections.Generic;\n\n`;

      const helperClasses: string[] = [];

      // Helpers to capitalize words
      const toPascalCase = (str: string) => {
        return str
          .replace(/[^A-Za-z0-9]/g, ' ')
          .split(' ')
          .filter(Boolean)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
      };

      const mapType = (val: any, fieldKey: string, parentClassName: string): string => {
        if (typeof val === 'number') {
          return Number.isInteger(val) ? 'int' : 'float';
        }
        if (typeof val === 'boolean') {
          return 'bool';
        }
        if (typeof val === 'string') {
          return 'string';
        }
        if (Array.isArray(val)) {
          if (val.length === 0) return 'List<string>';
          const firstVal = val[0];
          const innerT = mapType(firstVal, fieldKey + 'Item', parentClassName);
          return `List<${innerT}>`;
        }
        if (typeof val === 'object' && val !== null) {
          const subclassName = toPascalCase(fieldKey) + 'Item';
          buildClass(val, subclassName);
          return subclassName;
        }
        return 'string';
      };

      const buildClass = (obj: any, className: string) => {
        let classBlock = `[System.Serializable]\npublic class ${className}\n{\n`;

        Object.keys(obj).forEach(key => {
          const value = obj[key];
          const typeStr = mapType(value, key, className);
          const pascalKey = toPascalCase(key);
          const privateVarName = `_${key.trim()}`;

          if (useEncapsulation) {
            classBlock += `    [SerializeField, Tooltip("Data source mapping for ${key}")]\n`;
            classBlock += `    private ${typeStr} ${privateVarName};\n`;
            classBlock += `    public ${typeStr} ${pascalKey} => ${privateVarName};\n\n`;
          } else {
            classBlock += `    [SerializeField, Tooltip("Data source mapping for ${key}")]\n`;
            classBlock += `    public ${typeStr} ${pascalKey};\n\n`;
          }
        });

        classBlock += `}\n`;
        helperClasses.push(classBlock);
      };

      buildClass(parsed, csharpClassPrefix);

      // Assemble classes
      const rootClass = helperClasses[helperClasses.length - 1];
      const items = helperClasses.slice(0, helperClasses.length - 1).reverse();

      outputCode += rootClass + '\n' + items.join('\n');
      setGeneratedClassesText(outputCode);
    } catch (e: any) {
      setGeneratedClassesText(`// Invalid JSON detected:\n// Error: ${e.message}\n// Please make sure the JSON format is correctly aligned.`);
    }
  };

  useEffect(() => {
    convertJsonToCSharp();
  }, [jsonInput, csharpClassPrefix, useEncapsulation]);


  // =========================================================================
  // TOOL 6: Assembly Definition Creator (.asmdef) State & Logic
  // =========================================================================
  const [asmdefName, setAsmdefName] = useState('MyGame.Core');
  const [asmdefRefs, setAsmdefRefs] = useState<string[]>(['Unity.TextMeshPro', 'UnityEngine.UI']);
  const [newRefInput, setNewRefInput] = useState('');
  const [asmdefPlatforms, setAsmdefPlatforms] = useState([
    { name: 'Android', checked: true },
    { name: 'iOS', checked: true },
    { name: 'WebGL', checked: true },
    { name: 'Editor', checked: true },
    { name: 'WindowsStandalone64', checked: true },
    { name: 'Lumin', checked: false },
    { name: 'XboxOne', checked: false }
  ]);
  const [allowUnsafe, setAllowUnsafe] = useState(false);
  const [autoReferenced, setAutoReferenced] = useState(true);
  const [overrideReferences, setOverrideReferences] = useState(false);
  const [noEngineReferences, setNoEngineReferences] = useState(false);

  const handleAddRef = () => {
    if (newRefInput && !asmdefRefs.includes(newRefInput)) {
      setAsmdefRefs(prev => [...prev, newRefInput]);
      setNewRefInput('');
    }
  };

  const handleRemoveRef = (indexToRemove: number) => {
    setAsmdefRefs(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const togglePlatform = (name: string) => {
    setAsmdefPlatforms(prev => prev.map(p => p.name === name ? { ...p, checked: !p.checked } : p));
  };

  // Build JSON for asmdef
  const getAsmdefJson = () => {
    const activePlatforms = asmdefPlatforms.filter(p => p.checked).map(p => p.name);
    const resultObj: any = {
      name: asmdefName,
      references: asmdefRefs,
      includePlatforms: activePlatforms.length === asmdefPlatforms.length ? [] : activePlatforms,
      excludePlatforms: [],
      allowUnsafeCode: allowUnsafe,
      overrideReferences: overrideReferences,
      precompiledReferences: [],
      autoReferenced: autoReferenced,
      defineConstraints: [],
      versionDefines: [],
      noEngineReferences: noEngineReferences
    };

    return JSON.stringify(resultObj, null, 4);
  };


  return (
    <div id="unity_tools_app" className="min-h-screen bg-[#111111] text-slate-100 flex flex-col font-sans select-none selection:bg-[#0078D4]/40 selection:text-white">
      
      {/* HEADER BAR */}
      <header className="h-14 border-b border-[#282828] bg-[#1a1a1a] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Custom Unity-style Cube logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0078D4] to-[#005a9e] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md shadow-[#0078D4]/10">
            U
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">Unity Tools Workspace</h1>
            <p className="text-[10px] text-slate-400 mt-1">Multi-functional Suite for Unity 3D/2D Developers</p>
          </div>
        </div>

        {/* Workspace Tab Indicator */}
        <div className="hidden md:flex border border-[#2d2d2d] bg-[#141414] rounded-lg p-0.5 text-[11px] gap-1 shrink-0">
          <span className="px-2 py-1 flex items-center gap-1.5 text-[#00E5FF] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            LOCAL SERVER CONNECTED
          </span>
        </div>
      </header>

      {/* CORE FRAMEWORK DOCK */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* VIEW NAVIGATION / UTILITY DRAWER (Left Pane) */}
        <nav className="w-full lg:w-64 border-r border-[#282828] bg-[#181818] flex flex-row lg:flex-col p-2 gap-1 overflow-x-auto lg:overflow-y-auto shrink-0 md:scrollbar-thin">
          <div className="hidden lg:block px-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-2 mb-3">
            Editor Workspaces
          </div>
          
          <button
            onClick={() => setActiveTab('script')}
            className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold cursor-pointer transition-all duration-150 ${activeTab === 'script' ? 'bg-[#0078D4] text-white shadow-sm shadow-[#0078D4]/20' : 'text-slate-400 hover:bg-[#202020] hover:text-slate-200'}`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div className="truncate">C# Script Architect</div>
          </button>

          <button
            onClick={() => setActiveTab('palette')}
            className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold cursor-pointer transition-all duration-150 ${activeTab === 'palette' ? 'bg-[#0078D4] text-white shadow-sm shadow-[#0078D4]/20' : 'text-slate-400 hover:bg-[#202020] hover:text-slate-200'}`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <div className="truncate">Palette Float Exporter</div>
          </button>

          <button
            onClick={() => setActiveTab('layermask')}
            className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold cursor-pointer transition-all duration-150 ${activeTab === 'layermask' ? 'bg-[#0078D4] text-white shadow-sm shadow-[#0078D4]/20' : 'text-slate-400 hover:bg-[#202020] hover:text-slate-200'}`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <div className="truncate">Bitwise LayerMasks</div>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold cursor-pointer transition-all duration-150 ${activeTab === 'camera' ? 'bg-[#0078D4] text-white shadow-sm shadow-[#0078D4]/20' : 'text-slate-400 hover:bg-[#202020] hover:text-slate-200'}`}
          >
            <Camera className="w-4 h-4 shrink-0" />
            <div className="truncate">Cam & Pixel Math</div>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold cursor-pointer transition-all duration-150 ${activeTab === 'json' ? 'bg-[#0078D4] text-white shadow-sm shadow-[#0078D4]/20' : 'text-slate-400 hover:bg-[#202020] hover:text-slate-200'}`}
          >
            <FileJson className="w-4 h-4 shrink-0" />
            <div className="truncate">JSON to Serializable C#</div>
          </button>

          <button
            onClick={() => setActiveTab('asmdef')}
            className={`w-full text-left px-3 py-2.5 rounded-md flex items-center gap-3 text-xs font-semibold cursor-pointer transition-all duration-150 ${activeTab === 'asmdef' ? 'bg-[#0078D4] text-white shadow-sm shadow-[#0078D4]/20' : 'text-slate-400 hover:bg-[#202020] hover:text-slate-200'}`}
          >
            <FileCode className="w-4 h-4 shrink-0" />
            <div className="truncate">Assembly (.asmdef) Maker</div>
          </button>

          <div className="hidden lg:flex flex-col mt-auto p-3 border-t border-[#252525] bg-[#161616] rounded-lg mx-2 my-2 text-[11px] text-slate-400 gap-2">
            <div className="font-bold text-slate-300">Quick Docs Helper:</div>
            <p className="leading-relaxed text-[10px]">
              Use standard copy elements to dump codes straight down into your local Asset project system.
            </p>
          </div>
        </nav>

        {/* WORKSPACE DETAILED VIEWS (Center Context) */}
        <main className="flex-1 overflow-y-auto bg-[#1a1a1a] p-4 lg:p-6 flex flex-col gap-6 md:scrollbar-thin">

          {/* ================================================================= */}
          {/* TAB 1: AI C# SCRIPT ARCHITECT */}
          {/* ================================================================= */}
          {activeTab === 'script' && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="border border-slate-800 bg-[#202020] p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-md">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    AI C# Script Architect
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Describe your required mechanics and code style. Writes high-efficiency caching MonoBehaviours with tooltip attributes.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs bg-[#2b2b2b] px-3 py-1.5 rounded-lg border border-slate-800 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  Powered by Gemini-3.5-Flash
                </div>
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Configuration side (4 cols) */}
                <div className="xl:col-span-5 flex flex-col gap-5">
                  
                  {/* Quick templates */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Preset Templates</div>
                    <div className="flex flex-col gap-1.5">
                      {scriptTemplates.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setAiPrompt(item.prompt);
                            setScriptType(item.type);
                          }}
                          className="w-full text-left p-2.5 rounded bg-slate-900/60 hover:bg-[#202020] border border-slate-800/80 transition-all flex justify-between items-center text-xs group"
                        >
                          <div className="font-semibold text-slate-300 group-hover:text-[#00E5FF] transition-colors">{item.title}</div>
                          <div className="text-[10px] text-slate-500 bg-[#1e1e1e] px-2 py-0.5 rounded border border-slate-700/60">{item.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Settings and Prompt */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-4">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prompt & Options</div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-400 font-semibold">C# Script Prompt Requirements</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., Simple Raycast laser gun with shooting particle callbacks..."
                        rows={4}
                        className="w-full bg-[#202020] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400 font-semibold">Script Category</label>
                        <select
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                          value={scriptType}
                          onChange={(e) => setScriptType(e.target.value)}
                        >
                          <option value="Gameplay Utilities">Gameplay Utilities</option>
                          <option value="Movement & Physics">Movement & Physics</option>
                          <option value="Weapons & Combat">Weapons & Combat</option>
                          <option value="AI & Waypoints">AI & Waypoints</option>
                          <option value="Visual & Audio Effects">Visual & Audio Effects</option>
                          <option value="Save & Loading Profiles">Save & Loading Profiles</option>
                          <option value="Editor Tooling">Editor Tooling</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400 font-semibold">Complexity Level</label>
                        <select
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                          value={scriptComplexity}
                          onChange={(e) => setScriptComplexity(e.target.value)}
                        >
                          <option value="Clean & Simple">Clean & Simple</option>
                          <option value="Clean & Optimized">Clean & Optimized</option>
                          <option value="Advanced Architecture">Advanced Architecture</option>
                        </select>
                      </div>
                    </div>

                    {/* Checkbox settings */}
                    <div className="flex flex-col gap-2.5 py-1 text-xs">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scriptComments}
                          onChange={(e) => setScriptComments(e.target.checked)}
                          className="rounded text-[#0078D4] focus:ring-0 bg-slate-800 border-slate-800 w-4 h-4"
                        />
                        <span>Enable XML documentation details</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={highPerformanceMode}
                          onChange={(e) => setHighPerformanceMode(e.target.checked)}
                          className="rounded text-[#0078D4] focus:ring-0 bg-slate-800 border-slate-800 w-4 h-4"
                        />
                        <span className="flex items-center gap-1.5">
                          High Performance Mode
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">Non-alloc</span>
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={handleGenerateScript}
                      disabled={isGenerating}
                      className="w-full bg-[#0078D4] hover:bg-[#005a9e] disabled:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg border border-transparent hover:border-[#0078D4]/50 cursor-pointer transition-all flex items-center justify-center gap-2 shadow"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          COMPILING IN GEMINI ENGINE...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          GENERATE UNITY SCRIPT
                        </>
                      )}
                    </button>

                    {errorMessage && (
                      <div className="text-rose-400 text-xs bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                {/* Script Display Side (7 cols) */}
                <div className="xl:col-span-7 flex flex-col gap-4">
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col flex-1 gap-3.5">
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow shadow-emerald-500/40"></div>
                        <span className="text-xs font-bold text-slate-300 text-mono">
                          {generatedData.className}.cs
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCopy(generatedData.scriptCode, 'script')}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-2 rounded-lg text-slate-300 hover:text-[#00E5FF] transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        {copiedText === 'script' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied Script!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy File Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Code Container */}
                    <div className="bg-[#121212] rounded-lg border border-slate-900/80 p-3.5 h-[380px] overflow-auto select-text md:scrollbar-thin">
                      <pre className="text-left font-mono">
                        {renderCSharpHighlight(generatedData.scriptCode)}
                      </pre>
                    </div>

                    {/* Usage Descriptions */}
                    <div className="border-t border-slate-800/80 pt-3.5 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          INSPECTOR ASSEMBLY GUIDE:
                        </span>
                        
                        <button
                          onClick={() => handleCopy(generatedData.usageDescription, 'usage')}
                          className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'usage' ? (
                            <span className="text-emerald-400">Copied guide!</span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Guide Text</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-350 bg-[#1c1c1c] p-3 rounded-lg border border-slate-800/50 whitespace-pre-wrap select-text">
                        {generatedData.usageDescription}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: PALETTE EXPORTER TO VECTOR / COLOR */}
          {/* ================================================================= */}
          {activeTab === 'palette' && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="border border-slate-800 bg-[#202020] p-4 rounded-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#00E5FF]" />
                  Color Palette to Unity Vector & RGBA Exporter
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust color values to generate corresponding <code className="text-[#00E5FF]">UnityEngine.Color</code> parameters, automatically scaling ranges from standard 0-255 channels to normalized C# 0-1f floats.
                </p>
              </div>

              {/* Layout splits */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left controls panel */}
                <div className="lg:col-span-5 border border-slate-800 bg-[#161616] p-5 rounded-xl flex flex-col gap-5">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Color Picker Channels</div>

                  {/* Giant Color Preview Box */}
                  <div 
                    className="h-32 rounded-xl border border-slate-800 flex items-end justify-between p-3"
                    style={{ backgroundColor: `rgba(${displayR}, ${displayG}, ${displayB}, ${displayA / 255})` }}
                  >
                    <div className="bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-[10px] text-slate-200 font-mono">
                      {paletteHexInput}
                    </div>
                    <div className="bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-[10px] text-[#00E5FF] font-mono">
                      A: {displayA}
                    </div>
                  </div>

                  {/* Manual Hex Input */}
                  <div className="flex flex-col gap-1.5 focus-within:text-[#0078D4]">
                    <span className="text-[11px] text-slate-400 font-semibold">Hex Input</span>
                    <input
                      type="text"
                      value={paletteHexInput}
                      onChange={(e) => setPaletteHexInput(e.target.value)}
                      maxLength={7}
                      className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-[#0078D4] uppercase"
                    />
                  </div>

                  {/* RGBA Sliders */}
                  <div className="flex flex-col gap-3.5">
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-rose-400 font-bold">Red (R)</span>
                        <span>{rgbColor.r}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={rgbColor.r}
                        onChange={(e) => handleSliderChange('r', parseInt(e.target.value))}
                        className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">Green (G)</span>
                        <span>{rgbColor.g}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={rgbColor.g}
                        onChange={(e) => handleSliderChange('g', parseInt(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-sky-400 font-bold">Blue (B)</span>
                        <span>{rgbColor.b}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={rgbColor.b}
                        onChange={(e) => handleSliderChange('b', parseInt(e.target.value))}
                        className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">Alpha / Transparency (A)</span>
                        <span>{rgbColor.a}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={rgbColor.a}
                        onChange={(e) => handleSliderChange('a', parseInt(e.target.value))}
                        className="w-full accent-stone-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                  </div>

                  {/* Brightness Tint Adjuster */}
                  <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1">
                      <span>Multiply Aspect / Tint Intensity Factor</span>
                      <span className="text-[#00E5FF] font-mono">{tintFactor.toFixed(2)}x</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0.25, 0.5, 0.75, 1.0].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTintFactor(t)}
                          className={`p-1.5 rounded font-mono text-[10px] cursor-pointer border ${tintFactor === t ? 'bg-[#0078D4] border-transparent text-white' : 'bg-[#202020] border-slate-800 text-slate-400 hover:text-slate-200'}`}
                        >
                          {t === 1.0 ? 'Pure' : `${Math.round(t*100)}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right generated C# outputs panel */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  
                  {/* Preset Selector */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Popular Unity Presets</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {unityPalettes.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPaletteHexInput(item.hex)}
                          className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-[11px] flex flex-col items-center gap-1.5 cursor-pointer text-center group"
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-slate-700 inline-block group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="text-[10px] font-semibold text-slate-300 group-hover:text-white truncate w-full">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Exporters Block */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-4 flex-1">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">C# Structural Variables</div>

                    {/* Standard Color Vector */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-mono">UnityEngine.Color (Float 0-1f)</span>
                        <span className="font-semibold text-emerald-400">Recommended for Shaders & UI</span>
                      </div>
                      <div className="bg-[#121212] flex items-center justify-between p-2.5 rounded-lg border border-slate-900 select-text">
                        <code className="text-amber-300 text-xs font-mono select-all">
                          {colorCodeFloat}
                        </code>
                        <button
                          onClick={() => handleCopy(colorCodeFloat, 'palette_cs')}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedText === 'palette_cs' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Color32 channel */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">UnityEngine.Color32 (Integer 0-255)</span>
                      <div className="bg-[#121212] flex items-center justify-between p-2.5 rounded-lg border border-slate-900 select-text">
                        <code className="text-rose-300 text-xs font-mono select-all">
                          {colorCode32}
                        </code>
                        <button
                          onClick={() => handleCopy(colorCode32, 'palette_cs32')}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedText === 'palette_cs32' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Vector3 HSV representation */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">HSV to Vector3 Float (Hue, Saturation, Value)</span>
                      <div className="bg-[#121212] flex items-center justify-between p-2.5 rounded-lg border border-slate-900 select-text">
                        <code className="text-sky-300 text-xs font-mono select-all">
                          {getHSV(rgbColor.r, rgbColor.g, rgbColor.b)}
                        </code>
                        <button
                          onClick={() => handleCopy(getHSV(rgbColor.r, rgbColor.g, rgbColor.b), 'palette_hsv')}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedText === 'palette_hsv' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 text-xs leading-relaxed text-slate-400">
                      <strong>💡 Unity Pro Tip:</strong> Serialized Color fields in Unity automatically render with a built-in color-picker utility. If you copy values on the clipboard, you can right-click any <strong>Color</strong> swatch in the Inspector panel and select <strong>"Paste"</strong> to load them straight in!
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: BITWISE LAYERMASK RESOLVER */}
          {/* ================================================================= */}
          {activeTab === 'layermask' && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="border border-slate-800 bg-[#202020] p-4 rounded-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Physics LayerMask Bitmask & Decimal Calculator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  In Unity, the physics collision matrix corresponds to a 32-bit integer array. Toggle layer flags to view how individual index flags accumulate decimals or compile C# LayerMask calculations.
                </p>
              </div>

              {/* Grid block layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Layer Selector Panels (7 cols) */}
                <div className="xl:col-span-7 border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configure Active Physics Layers</span>
                    
                    {/* Floating quick reset */}
                    <button
                      onClick={() => setLayers(DEFAULT_UNITY_LAYERS)}
                      className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Undo className="w-3" />
                      Reset to Default Layers
                    </button>
                  </div>

                  {/* Layers Grid (32 columns of checkmarks arranged nicely) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[420px] overflow-auto pr-1 md:scrollbar-thin">
                    {layers.map((lyr) => (
                      <div 
                        key={lyr.id} 
                        className={`flex items-center justify-between p-2 rounded-lg border transition-all ${lyr.active ? 'bg-emerald-500/5 border-emerald-500/25 text-white' : 'bg-slate-900/40 border-slate-850 text-slate-400'}`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="checkbox"
                            checked={lyr.active}
                            onChange={() => toggleLayerActive(lyr.id)}
                            className="rounded text-emerald-500 focus:ring-0 bg-slate-800 border-slate-700 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-[11px] font-mono text-slate-500 w-4">{lyr.id}</span>
                          <input
                            type="text"
                            value={lyr.name}
                            onChange={(e) => handleUpdateLayerName(lyr.id, e.target.value)}
                            className="bg-transparent border-b border-transparent focus:border-slate-700 text-xs py-0.5 text-slate-300 focus:outline-none truncate w-24 sm:w-28 font-medium"
                          />
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono">
                          {lyr.active ? `1 << ${lyr.id}` : 'off'}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Layer Logic Math Outputs (5 cols) */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                  
                  {/* Aggregated values panel */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-4.5">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Bitwise Aggregation Matrix</div>
                    
                    {/* Decimal Mask value card */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">LayerMask Decimal Value</div>
                      <div className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
                        {totalMaskValue}
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1">Assign serialized integer fields to load this mask</p>
                    </div>

                    {/* Raw 32bt binary block */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">32-Bit Binary Bitmask (Indices 31 down to 0)</span>
                      <div className="bg-[#121212] p-3 rounded-lg border border-slate-900 font-mono text-center tracking-widest select-all text-emerald-300 text-xs">
                        {getBinaryString(totalMaskValue)}
                      </div>
                    </div>

                    {/* active triggers summary */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1.5">Active Physics Channels:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {layers.filter(l => l.active).map(l => (
                          <span key={l.id} className="text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-350 px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Layer {l.id}: {l.name}
                          </span>
                        ))}
                        {layers.filter(l => l.active).length === 0 && (
                          <span className="text-[10px] text-slate-500 italic">No channel flags selected</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Generated C# script snippet */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">C# Collision Implementation</span>
                      
                      <button
                        onClick={() => handleCopy(getLayerMaskCSharpCode(), 'layers_csharp')}
                        className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === 'layers_csharp' ? (
                          <span className="text-emerald-400">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-3" />
                            <span>Copy Snippet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#121212] rounded-lg border border-slate-950 p-3 h-[200px] overflow-auto select-text md:scrollbar-thin">
                      <pre className="text-left text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre">
                        {getLayerMaskCSharpCode()}
                      </pre>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: CAMERA RESOLUTION & PIXEL PERFECT FOV CALCULATOR */}
          {/* ================================================================= */}
          {activeTab === 'camera' && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="border border-slate-800 bg-[#202020] p-4 rounded-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" />
                  Camera Resolution, Orthographic Size, and 3D FOV Solver
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust target game resolutions, pixels-per-units (PPU) for retro 2D games, or aspect ratios for 3D viewports to calculate exact parameters to secure pixel-perfect alignment.
                </p>
              </div>

              {/* Grid block layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Configuration controls panel (5 cols) */}
                <div className="xl:col-span-5 flex flex-col gap-5">
                  
                  {/* Mode Selector Toggle */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-4">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. 2D Sprite Pixel-Perfect Settings</div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
                        <span className="text-[11px] text-slate-400 font-semibold">Width Resolution</span>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(parseInt(e.target.value) || 1920)}
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
                        <span className="text-[11px] text-slate-400 font-semibold">Height Resolution</span>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(parseInt(e.target.value) || 1080)}
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
                        <span className="text-[11px] text-slate-400 font-semibold">Pixels Per Unit (PPU)</span>
                        <input
                          type="number"
                          value={pixelsPerUnit}
                          onChange={(e) => setPixelsPerUnit(parseInt(e.target.value) || 16)}
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
                        <span className="text-[11px] text-slate-400 font-semibold">Zoom Multiplier</span>
                        <input
                          type="number"
                          step="0.1"
                          value={orthoScale}
                          onChange={(e) => setOrthoScale(parseFloat(e.target.value) || 1.0)}
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3D camera settings parameters */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-4">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. 3D Camera Lens & Field of View</div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-slate-400 font-semibold">Input Angle Type</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setIsVerticalInput(true)}
                          className={`p-1.5 rounded cursor-pointer text-xs font-semibold ${isVerticalInput ? 'bg-[#0078D4] text-white' : 'bg-[#202020] text-slate-400'}`}
                        >
                          Vertical FOV (V-FOV)
                        </button>
                        <button
                          onClick={() => setIsVerticalInput(false)}
                          className={`p-1.5 rounded cursor-pointer text-xs font-semibold ${!isVerticalInput ? 'bg-[#0078D4] text-white' : 'bg-[#202020] text-slate-400'}`}
                        >
                          Horizontal FOV (H-FOV)
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span className="font-semibold">Input Angle (Degrees)</span>
                        <span className="font-mono text-indigo-400 font-bold">{angleInput}°</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="140"
                        value={angleInput}
                        onChange={(e) => setAngleInput(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
                        <span className="text-[11px] text-slate-400 font-semibold">Aspect Ratio Width</span>
                        <input
                          type="number"
                          value={cameraAspectWidth}
                          onChange={(e) => setCameraAspectWidth(parseInt(e.target.value) || 16)}
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
                        <span className="text-[11px] text-slate-400 font-semibold">Aspect Ratio Height</span>
                        <input
                          type="number"
                          value={cameraAspectHeight}
                          onChange={(e) => setCameraAspectHeight(parseInt(e.target.value) || 9)}
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Mathematical Visual Display Panel (7 cols) */}
                <div className="xl:col-span-7 flex flex-col gap-4">
                  
                  {/* Ortho visual blueprint */}
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex-1 flex flex-col gap-4">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Calculated Camera Properties</div>

                    {/* Stats metrics layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Required Ortho Size</div>
                        <div className="text-lg font-black text-[#00E5FF] font-mono leading-none py-1">
                          {calculatedOrthoSize.toFixed(4)}
                        </div>
                        <div className="text-[8px] text-slate-400 font-semibold">Assign to camera.orthographicSize</div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Viewport Dimensions</div>
                        <div className="text-lg font-black text-rose-400 font-mono leading-none py-1">
                          {viewportWidthInUnits.toFixed(2)}x{viewportHeightInUnits.toFixed(2)}
                        </div>
                        <div className="text-[8px] text-slate-400 font-semibold">In game units (metric)</div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">FOV Calibration</div>
                        <div className="text-lg font-black text-indigo-400 font-mono leading-none py-1">
                          V: {calculatedVerticalFov.toFixed(1)}° / H: {calculatedHorizontalFov.toFixed(1)}°
                        </div>
                        <div className="text-[8px] text-slate-400 font-semibold">For Aspect: {cameraAspectWidth}:{cameraAspectHeight}</div>
                      </div>

                    </div>

                    {/* Camera geometry helper blueprint canvas */}
                    <div className="bg-[#121212] border border-slate-950 rounded-lg p-5 flex flex-col items-center justify-center min-h-[180px] gap-3 relative overflow-hidden">
                      {/* Grid background design */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>
                      
                      {/* Interactive schematic vector drawing */}
                      <div className="relative w-40 h-28 border border-[#00E5FF]/30 bg-[#00E5FF]/5 p-2 rounded flex flex-col justify-between items-center shadow shadow-[#00E5FF]/2 text-[10px]">
                        <span className="text-[#00E5FF] font-bold">1920x1080 Aspect Ortho</span>
                        
                        {/* Center Box representing 1 Unit block */}
                        <div className="w-12 h-12 border border-dashed border-slate-600 flex items-center justify-center text-[8px] text-slate-400 bg-slate-950/40">
                          1x1 Unit ({pixelsPerUnit}px PPU)
                        </div>

                        <div className="w-full flex justify-between text-slate-500 text-[8px] font-mono select-none px-1">
                          <span>W: {viewportWidthInUnits.toFixed(1)}u</span>
                          <span>H: {viewportHeightInUnits.toFixed(1)}u</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 text-center max-w-sm mt-1 z-10">
                        At a sprite height spacing of <code className="text-[#00E5FF] font-bold font-mono">{pixelsPerUnit}</code> pixels, this layout secures integer scaling. It keeps sprites pixel-perfect in WebGL, Android, and Desktop builds.
                      </p>
                    </div>

                    {/* Generated code copyable block */}
                    <div className="border-t border-slate-800 pt-3 flex flex-col gap-2 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">C# Camera Setup script</span>
                        <button
                          onClick={() => handleCopy(getCameraMathCSharp(), 'camera_cs')}
                          className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === 'camera_cs' ? (
                            <span className="text-emerald-400">Copied Calibration script!</span>
                          ) : (
                            <>
                              <Copy className="w-3" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-[#121212] p-3 rounded-lg border border-slate-950 h-[110px] overflow-auto text-left select-all md:scrollbar-thin">
                        <pre className="text-[10px] font-mono text-slate-400 whitespace-pre leading-relaxed">
                          {getCameraMathCSharp()}
                        </pre>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: JSON TO SERIALIZABLE C# MODEL CONVERTER */}
          {/* ================================================================= */}
          {activeTab === 'json' && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="border border-slate-800 bg-[#202020] p-4 rounded-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-amber-500" />
                  JSON to Unity Serializable C# Class Generator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Paste JSON game design data (e.g. game balancing rules, inventory matrices, save profiles) to instantly convert them into clean C# classes that compile and deserialize out-of-the-box in Unity.
                </p>
              </div>

              {/* Grid block layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Input block side */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-3.5 h-full">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configure JSON Input Settings</div>

                    <div className="flex flex-col gap-1.5 focus-within:text-amber-400">
                      <label className="text-[11px] text-slate-400 font-semibold">Class Root Prefix</label>
                      <input
                        type="text"
                        value={csharpClassPrefix}
                        onChange={(e) => setCsharpClassPrefix(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
                        className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2.5 py-1 text-xs">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useEncapsulation}
                          onChange={(e) => setUseEncapsulation(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-0 bg-slate-800 border-slate-800 w-4 h-4 text-xs"
                        />
                        <span>Encapsulate with private fields & public get properties</span>
                      </label>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 focus-within:text-amber-400 mb-1">
                      <label className="text-[11px] text-slate-400 font-semibold">JSON Data Body</label>
                      <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="w-full bg-[#121212] border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-amber-500 h-[280px] resize-none select-text md:scrollbar-thin"
                      />
                    </div>

                  </div>
                </div>

                {/* Output block C# side */}
                <div className="xl:col-span-7 flex flex-col gap-4">
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col flex-1 gap-3.5">
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {csharpClassPrefix}.cs
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(generatedClassesText, 'json_cs')}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        {copiedText === 'json_cs' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Classes Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Classes C#</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#121212] rounded-lg border border-slate-950 p-4 h-[380px] overflow-auto select-text md:scrollbar-thin">
                      <pre className="text-left text-xs font-mono leading-relaxed text-slate-300 whitespace-pre">
                        {generatedClassesText}
                      </pre>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-400">
                      <strong>✨ Unity JsonUtility Standard:</strong> Parse your JSON file cleanly using standard engine libraries:
                      <code className="block mt-1 bg-slate-950 p-2 rounded text-amber-300 font-mono text-[10px]">
                        {csharpClassPrefix} dataObj = JsonUtility.FromJson&lt;{csharpClassPrefix}&gt;(jsonStringText);
                      </code>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: ASSEMBLY DEFINITION (.ASMDEF) CREATOR */}
          {/* ================================================================= */}
          {activeTab === 'asmdef' && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="border border-slate-800 bg-[#202020] p-4 rounded-xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-blue-400" />
                  Assembly Definition (.asmdef) Maker
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Assembly Definitions (.asmdef) allow you to segregate code scripts into modular compilation clusters, immensely speeding up build pipelines when updating small code modules.
                </p>
              </div>

              {/* Grid block layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Configuration side Panel (5 cols) */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col gap-4.5">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configure Assembly Parameters</div>

                    {/* Assembly Name */}
                    <div className="flex flex-col gap-1.5 focus-within:text-blue-400">
                      <span className="text-[11px] text-slate-400 font-semibold">Assembly Unique Name</span>
                      <input
                        type="text"
                        value={asmdefName}
                        onChange={(e) => setAsmdefName(e.target.value)}
                        className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* References adding fields */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-slate-400 font-semibold">Assembly References (References modules list)</span>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRefInput}
                          onChange={(e) => setNewRefInput(e.target.value)}
                          placeholder="e.g. Unity.Mathematics"
                          className="bg-[#202020] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 flex-1 font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddRef();
                          }}
                        />
                        <button
                          onClick={handleAddRef}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3.5 rounded-lg font-bold cursor-pointer transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {/* Display list tags */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {asmdefRefs.map((ref, idx) => (
                          <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] pl-2.5 pr-1.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
                            {ref}
                            <button
                              onClick={() => handleRemoveRef(idx)}
                              className="text-slate-500 hover:text-rose-400 text-xs font-bold px-0.5 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {asmdefRefs.length === 0 && (
                          <span className="text-[10px] text-slate-500 italic">No custom dependencies referenced</span>
                        )}
                      </div>
                    </div>

                    {/* Include platforms list */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-slate-400 font-semibold">Included Platforms (Empty implies ALL platforms)</span>
                      <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-auto border border-slate-800/60 p-2 rounded bg-slate-950/40 md:scrollbar-thin">
                        {asmdefPlatforms.map((p, idx) => (
                          <label key={idx} className="flex items-center gap-2 cursor-pointer text-[10px] text-slate-350">
                            <input
                              type="checkbox"
                              checked={p.checked}
                              onChange={() => togglePlatform(p.name)}
                              className="rounded text-blue-500 focus:ring-0 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                            />
                            {p.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Additional Options toggles */}
                    <div className="flex flex-col gap-2 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowUnsafe}
                          onChange={(e) => setAllowUnsafe(e.target.checked)}
                          className="rounded text-blue-500 focus:ring-0 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                        />
                        <span>Allow Unsafe Compiled Code</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoReferenced}
                          onChange={(e) => setAutoReferenced(e.target.checked)}
                          className="rounded text-blue-500 focus:ring-0 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                        />
                        <span>Auto Referenced (Assemblies globally pooled)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={overrideReferences}
                          onChange={(e) => setOverrideReferences(e.target.checked)}
                          className="rounded text-blue-500 focus:ring-0 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                        />
                        <span>Override References (Map custom DLL models)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={noEngineReferences}
                          onChange={(e) => setNoEngineReferences(e.target.checked)}
                          className="rounded text-blue-500 focus:ring-0 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                        />
                        <span>Disable Engine References (C# pure standard library)</span>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Display Output JSON block Panel (7 cols) */}
                <div className="xl:col-span-7 flex flex-col gap-4">
                  <div className="border border-slate-800 bg-[#161616] p-4 rounded-xl flex flex-col flex-1 gap-3.5">
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {asmdefName}.asmdef
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(getAsmdefJson(), 'asmdef_json')}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        {copiedText === 'asmdef_json' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied JSON!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy File JSON</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#121212] rounded-lg border border-slate-950 p-4 h-[350px] overflow-auto select-text md:scrollbar-thin">
                      <pre className="text-left text-xs font-mono leading-relaxed text-blue-200 whitespace-pre">
                        {getAsmdefJson()}
                      </pre>
                    </div>

                    <p className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2.5 rounded border border-slate-800 mt-2">
                      💡 <strong>Save Instructions:</strong> Save this exact output to a file named <code className="text-[#00E5FF] font-bold font-mono">{asmdefName}.asmdef</code> somewhere in your Unity project and the Unity compiler will bundle it instantly.
                    </p>

                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
