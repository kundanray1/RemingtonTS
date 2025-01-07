import ezdxf
from ezdxf.math import Vec3

def extract_dxf_data(file_path):
    # Open the DXF file
    doc = ezdxf.readfile(file_path)
    
    # Extract header variables (extents and units)
    extents = {
        "extmin": doc.header.get("$EXTMIN", None),
        "extmax": doc.header.get("$EXTMAX", None),
        "units": doc.header.get("$INSUNITS", "Unknown"),
    }
    print("Header Variables:", extents)

    # Extract layer information
    layers = {}
    for layer in doc.layers:
        layers[layer.dxf.name] = {
            "color": layer.dxf.color,
            "linetype": layer.dxf.linetype,
            "is_frozen": layer.is_frozen,
            "is_locked": layer.is_locked,
        }
    print("Layers:", layers)

    # Entity data
    entities = []
    for entity in doc.modelspace():
        entity_data = {"type": entity.dxftype(), "layer": entity.dxf.layer}
        
        if entity.dxftype() == "POLYLINE":
            entity_data.update({
                "vertices": [{"x": v.dxf.location.x, "y": v.dxf.location.y, "z": v.dxf.location.z, "bulge": v.dxf.bulge} for v in entity.vertices],
                "is_closed": entity.is_closed,
                "flags": entity.dxf.flags,
                "mode": entity.get_mode() if hasattr(entity, "get_mode") else "Unknown",
            })
        elif entity.dxftype() == "LINE":
            entity_data.update({
                "start": {"x": entity.dxf.start.x, "y": entity.dxf.start.y, "z": entity.dxf.start.z},
                "end": {"x": entity.dxf.end.x, "y": entity.dxf.end.y, "z": entity.dxf.end.z},
            })
        elif entity.dxftype() == "CIRCLE":
            entity_data.update({
                "center": {"x": entity.dxf.center.x, "y": entity.dxf.center.y, "z": entity.dxf.center.z},
                "radius": entity.dxf.radius,
            })
        elif entity.dxftype() == "ARC":
            entity_data.update({
                "center": {"x": entity.dxf.center.x, "y": entity.dxf.center.y, "z": entity.dxf.center.z},
                "radius": entity.dxf.radius,
                "start_angle": entity.dxf.start_angle,
                "end_angle": entity.dxf.end_angle,
            })
        elif entity.dxftype() == "INSERT":
            entity_data.update({
                "name": entity.dxf.name,
                "insert": {"x": entity.dxf.insert.x, "y": entity.dxf.insert.y, "z": entity.dxf.insert.z},
                "scale": {"x": entity.dxf.xscale, "y": entity.dxf.yscale, "z": entity.dxf.zscale},
                "rotation": entity.dxf.rotation,
            })

        # Append full entity data
        entities.append(entity_data)

    # Output results
    print("Entities:")
    for entity in entities:
        print(entity)

    # Save as JSON-like structure for easy sharing if needed
    return {
        "header": extents,
        "layers": layers,
        "entities": entities,
    }

# Replace with the path to your DXF file
dxf_file_path = "./CADexport.dxf"
dxf_data = extract_dxf_data(dxf_file_path)
