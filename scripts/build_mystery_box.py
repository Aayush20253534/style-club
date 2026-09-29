"""Build four detailed Style Club mystery boxes as GLB + editable Blender files.

Blender 4.x/5.x:
  blender --background --python scripts/build_mystery_box.py -- \
    public/models/style-club-mystery-box.glb media/style-club-mystery-box.blend

Arguments are filename stems. Outputs get -2500, -5000, -7500, -10000.
The named GiftLid empty is the animation pivot used by GiftScene.tsx.
"""

import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector


TIERS = (
    dict(key="2500", w=1.26, d=1.04, h=1.02, shell="103985",
         lid="164A9B", panel="123C8A", satin="D8B97A", metal="E8CB88",
         seal=48, bow=0.18, details="classic"),
    dict(key="5000", w=1.24, d=1.03, h=1.40, shell="AD623B",
         lid="C1784D", panel="A65C36", satin="F0D5A2", metal="E8C184",
         seal=6, bow=0.21, details="portrait"),
    dict(key="7500", w=1.76, d=1.17, h=0.96, shell="571838",
         lid="6C2449", panel="581838", satin="D9BB8C", metal="EBC988",
         seal=8, bow=0.24, details="wide"),
    dict(key="10000", w=1.44, d=1.17, h=1.45, shell="D9CBB0",
         lid="E4D6BE", panel="E5D7BD", satin="EAD8B5", metal="C39755",
         seal=12, bow=0.24, details="grand"),
)


def linear(value):
    value = int(value, 16) / 255
    return value / 12.92 if value < 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def material(name, color, metallic=0.0, roughness=0.3, coat=0.0):
    mat = bpy.data.materials.new(name)
    rgb = tuple(linear(color[i:i + 2]) for i in (0, 2, 4))
    mat.diffuse_color = (*rgb, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*rgb, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    coat_input = shader.inputs.get("Coat Weight")
    if coat_input:
        coat_input.default_value = coat
    return mat


def parent_world(obj, parent):
    world = obj.matrix_world.copy()
    obj.parent = parent
    obj.matrix_world = world
    return obj


def box(name, center, dimensions, mat, bevel=0.012, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Tailored rounded edges", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        bpy.ops.object.modifier_apply(modifier=mod.name)
        normal = obj.modifiers.new("Weighted face normals", "WEIGHTED_NORMAL")
        bpy.ops.object.modifier_apply(modifier=normal.name)
    if parent:
        parent_world(obj, parent)
    return obj


def tube(name, points, radius, mat, parent=None):
    curve = bpy.data.curves.new(name, type="CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    poly = curve.splines.new("POLY")
    poly.points.add(len(points) - 1)
    for point, xyz in zip(poly.points, points):
        point.co = (*xyz, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    obj = bpy.context.object
    obj.data.materials.append(mat)
    if parent:
        parent_world(obj, parent)
    return obj


def frame_front(prefix, w, h, y, z0, metal, parent=None, thickness=0.008):
    """Four separate rails form an inset rectangular frame on the front."""
    x = w / 2
    z1 = z0 + h
    for sign in (-1, 1):
        box(f"{prefix}_Vertical_{sign}", (sign * x, y, (z0 + z1) / 2),
            (thickness, thickness, h), metal, thickness / 3, parent)
        box(f"{prefix}_Horizontal_{sign}", (0, y, z0 if sign < 0 else z1),
            (w, thickness, thickness), metal, thickness / 3, parent)


def ribbon_strip(name, controls, width, mat, edging, parent):
    """A stitched, softly folded satin band following a sculpted 3D path.

    Each bow loop has a true broad face, thickness and edge piping, rather
    than the rigid circular torus in the first prototype.
    """
    controls = [Vector(p) for p in controls]
    sampled = []
    for i in range(len(controls) - 1):
        before = controls[max(0, i - 1)]
        a, b = controls[i], controls[i + 1]
        after = controls[min(len(controls) - 1, i + 2)]
        for step in range(9):
            t = step / 9
            point = 0.5 * (
                2 * a + (-before + b) * t +
                (2 * before - 5 * a + 4 * b - after) * t * t +
                (-before + 3 * a - 3 * b + after) * t * t * t
            )
            sampled.append(point)
    sampled.append(controls[-1])
    left, right = [], []
    for i, point in enumerate(sampled):
        tangent = sampled[min(i + 1, len(sampled) - 1)] - sampled[max(i - 1, 0)]
        direction = Vector((-tangent.z, 0, tangent.x))
        if direction.length < 0.001:
            direction = Vector((0, 0, 1))
        direction.normalize()
        taper = min(1, 0.52 + i / 6, 0.52 + (len(sampled) - i - 1) / 6)
        fold = 1 + 0.075 * math.sin(i * 0.65)
        left.append(point - direction * width * taper * fold / 2)
        right.append(point + direction * width * taper * fold / 2)

    # Front, back and the thin exposed cloth edges form a closed mesh.
    vertices = []
    for a, b in zip(left, right):
        for p in (a, b):
            vertices.append((p.x, p.y - 0.006, p.z))
            vertices.append((p.x, p.y + 0.006, p.z))
    faces = []
    for i in range(len(sampled) - 1):
        k = 4 * i
        faces.extend(((k, k + 4, k + 6, k + 2),
                      (k + 1, k + 3, k + 7, k + 5),
                      (k, k + 1, k + 5, k + 4),
                      (k + 2, k + 6, k + 7, k + 3)))
    end = len(vertices) - 4
    faces.extend(((0, 2, 3, 1), (end, end + 1, end + 3, end + 2)))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    mesh.materials.append(mat)
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    parent_world(obj, parent)
    # Fine raised satin piping makes the loop's outline legible at card size.
    for suffix, edge in (("L", left), ("R", right)):
        tube(f"{name}_Piping_{suffix}",
             [(p.x, p.y - 0.010, p.z) for p in edge], 0.004, edging, parent)


def bow(tier, mat, edging, lid, top):
    size = tier["bow"]
    front = -0.07
    for sign in (-1, 1):
        # Loop arcs upward and outward, then curls back into the knot.
        ribbon_strip(
            f"GiftRibbon_BowLoop_{sign}",
            [(sign * 0.03, front, top + 0.12),
             (sign * size * 0.8, front - 0.01, top + 0.29),
             (sign * size * 2.05, front + 0.01, top + 0.46),
             (sign * size * 2.0, front + 0.02, top + 0.30),
             (sign * 0.08, front + 0.025, top + 0.13)],
            0.16 if tier["details"] != "grand" else 0.18,
            mat, edging, lid,
        )
        ribbon_strip(
            f"GiftRibbon_Tail_{sign}",
            [(sign * 0.035, front - 0.02, top + 0.12),
             (sign * 0.17, front - 0.035, top + 0.12),
             (sign * (size + 0.16), front - 0.09, top + 0.055),
             (sign * (size + 0.33), front - 0.14, top - 0.08)],
            0.16 if tier["details"] != "grand" else 0.18,
            mat, edging, lid,
        )
    box("GiftRibbon_BowKnot", (0, front - 0.03, top + 0.13),
        (0.15, 0.085, 0.16), mat, 0.035, lid)


def seal(tier, metal, highlight, ink):
    d, h = tier["d"], tier["h"]
    y = -d / 2 - 0.047
    radius = 0.17 if tier["details"] == "classic" else 0.19
    for i, (scale, depth, finish) in enumerate(
        ((1.0, 0.034, metal), (0.82, 0.038, highlight))
    ):
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=tier["seal"], radius=radius * scale, depth=0.018,
            location=(0, y - depth, h * 0.55), rotation=(math.pi / 2, 0, 0),
        )
        coin = bpy.context.object
        coin.name = f"MysterySeal_{'Rim' if i == 0 else 'Face'}"
        coin.data.materials.append(finish)
        mod = coin.modifiers.new("Stamped rim", "BEVEL")
        mod.width = 0.008
        mod.segments = 3
        bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.text_add(
        location=(0, y - 0.062, h * 0.55 - 0.107),
        rotation=(math.pi / 2, 0, 0),
    )
    mark = bpy.context.object
    mark.name = "MysteryInk_Question"
    mark.data.body = "?"
    mark.data.align_x = "CENTER"
    mark.data.size = 0.24
    mark.data.extrude = 0.002
    mark.data.materials.append(ink)
    bpy.ops.object.convert(target="MESH")


def build(tier):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    w, d, h = tier["w"], tier["d"], tier["h"]
    shell = material("BoxShell", tier["shell"], roughness=0.53, coat=0.10)
    panel = material("BoxInsetPanel", tier["panel"], roughness=0.48)
    lid_mat = material("LidShell", tier["lid"], roughness=0.44, coat=0.15)
    satin = material("GiftRibbon_Satin", tier["satin"], metallic=0.10,
                     roughness=0.29, coat=0.3)
    metal = material("Metal_Trim", tier["metal"], metallic=0.78, roughness=0.24)
    pale = material("MysterySeal_Enamel", "F2DFAA", metallic=0.42, roughness=0.29)
    ink = material("MysteryInk", "79552C" if tier["details"] == "grand" else "45311E",
                   metallic=0.12, roughness=0.37)
    lining = material("InnerLining", "22223A" if tier["details"] != "grand"
                      else "867660", roughness=0.85)

    # A real open interior remains dark and empty when the lid is animated.
    wall = 0.065
    box("BoxShell_Bottom", (0, 0, wall / 2), (w, d, wall), shell, 0.015)
    for sign in (-1, 1):
        box(f"BoxShell_FrontBack_{sign}", (0, sign * (d - wall) / 2, h / 2),
            (w, wall, h), shell, 0.022)
        box(f"BoxShell_Sides_{sign}", (sign * (w - wall) / 2, 0, h / 2),
            (wall, d - wall * 2, h), shell, 0.022)
    box("InnerLining_Bottom", (0, 0, wall + 0.004),
        (w - wall * 2, d - wall * 2, 0.009), lining, 0.004)
    # The inner wall lining is visible when the lid pivots open.
    for sign in (-1, 1):
        box(f"InnerLining_Wall_{sign}", (0, sign * (d / 2 - wall - 0.004), h * 0.55),
            (w - wall * 2, 0.007, h * 0.82), lining, 0.001)

    # Inset front panel with individually modelled gold rails.
    if tier["details"] != "classic":
        margin = 0.125
        panel_w = w - 2 * margin
        panel_h = h - 0.23
        y = -d / 2 - 0.008
        box("BoxInsetPanel_Front", (0, y, h / 2),
            (panel_w, 0.014, panel_h), panel, 0.018)
        frame_front("Metal_FrontFrame", panel_w - 0.045, panel_h - 0.045,
                    y - 0.012, h / 2 - (panel_h - 0.045) / 2, metal)
        if tier["details"] == "grand":
            frame_front("Metal_SecondFrame", panel_w - 0.105, panel_h - 0.105,
                        y - 0.017, h / 2 - (panel_h - 0.105) / 2,
                        metal, thickness=0.004)
    else:
        frame_front("Metal_CleanEdge", w - 0.052, h - 0.075,
                    -d / 2 - 0.009, 0.038, metal, thickness=0.006)

    # Tight wrapping on both visible faces, with a separate raised seam.
    ribbon_width = 0.135 if tier["details"] != "grand" else 0.16
    box("GiftRibbon_Front", (0, -d / 2 - 0.023, h / 2),
        (ribbon_width, 0.022, h - 0.025), satin, 0.007)
    box("GiftRibbon_Right", (w / 2 + 0.013, 0, h / 2),
        (0.022, ribbon_width, h - 0.025), satin, 0.007)
    if tier["details"] == "wide":
        for sign in (-1, 1):
            box(f"GiftRibbon_Secondary_{sign}",
                (sign * w * 0.32, -d / 2 - 0.023, h / 2),
                (0.055, 0.02, h - 0.03), satin, 0.005)
        for sign in (-1, 1):
            box(f"Metal_Corner_{sign}", (sign * (w / 2 - 0.037),
                -d / 2 - 0.023, h - 0.08),
                (0.072, 0.025, 0.09), metal, 0.011)
    if tier["details"] in ("portrait", "wide", "grand"):
        box("Metal_SeamFront", (0, -d / 2 - 0.007, h - 0.07),
            (w + 0.02, 0.018, 0.012), metal, 0.004)
        box("Metal_SeamRight", (w / 2 + 0.007, 0, h - 0.07),
            (0.018, d + 0.02, 0.012), metal, 0.004)
    if tier["details"] == "grand":
        for z in (0.052, 0.115):
            box(f"Metal_BasePlinth_{z}", (0, 0, z), (w + 0.055, d + 0.055, 0.022),
                metal, 0.009)
    seal(tier, metal, pale, ink)

    # A back-edge hinge empty: GiftLid and every decoration on it rotate as one.
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, d / 2 + 0.055, h - 0.035))
    lid = bpy.context.object
    lid.name = "GiftLid"
    lid_h = 0.24 if tier["details"] != "grand" else 0.29
    lid_top = h + lid_h
    box("LidShell_Main", (0, 0, h + lid_h / 2),
        (w + 0.12, d + 0.12, lid_h), lid_mat, 0.028, lid)
    box("Metal_LidLowerLip", (0, -d / 2 - 0.062, h + 0.023),
        (w + 0.13, 0.009, 0.01), metal, 0.003, lid)
    box("GiftRibbon_LidLengthwise", (0, 0, lid_top + 0.01),
        (ribbon_width, d + 0.13, 0.014), satin, 0.005, lid)
    box("GiftRibbon_LidCrosswise", (0, 0, lid_top + 0.012),
        (w + 0.13, ribbon_width, 0.014), satin, 0.005, lid)
    if tier["details"] == "grand":
        frame_front("Metal_LidFrontInset", w - 0.13, lid_h - 0.075,
                    -d / 2 - 0.067, h + 0.037, metal, lid, thickness=0.006)
        for sign in (-1, 1):
            box(f"Metal_LidCrownRail_{sign}",
                (sign * (w / 2 - 0.078), 0, lid_top + 0.017),
                (0.008, d - 0.20, 0.01), metal, 0.003, lid)
    bow(tier, satin, metal, lid, lid_top)
    bpy.context.view_layer.update()


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    output_stem = Path(args[0] if args else "public/models/style-club-mystery-box.glb").resolve()
    blend_stem = Path(args[1]).resolve() if len(args) > 1 else output_stem.with_suffix(".blend")
    output_stem.parent.mkdir(parents=True, exist_ok=True)
    blend_stem.parent.mkdir(parents=True, exist_ok=True)
    for tier in TIERS:
        build(tier)
        output = output_stem.with_name(f"{output_stem.stem}-{tier['key']}.glb")
        blend = blend_stem.with_name(f"{blend_stem.stem}-{tier['key']}.blend")
        bpy.ops.wm.save_as_mainfile(filepath=str(blend))
        bpy.ops.export_scene.gltf(
            filepath=str(output), export_format="GLB", export_yup=True,
            export_animations=False, export_cameras=False, export_lights=False,
            export_apply=False,
        )
        print(f"Exported {output} ({output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
