import ezdxf
import json


def extract_dxf_data(file_path, output_json_path):
    # Open the DXF file
    doc = ezdxf.readfile(file_path)
    
    # Extract header variables (extents and units)
    extents = {
        "extmin": str(doc.header.get("$EXTMIN", None)),
        "extmax": str(doc.header.get("$EXTMAX", None)),
        "units": doc.header.get("$INSUNITS", "Unknown"),
    }

    # Extract layer information
    layers = {}
    for layer in doc.layers:
        layers[layer.dxf.name] = {
            "color": layer.dxf.color,
            "linetype": layer.dxf.linetype,
            "is_frozen": layer.is_frozen,
            "is_locked": layer.is_locked,
        }

    # Entity data
    entities = []
    for entity in doc.modelspace():
        try:
            entity_data = {"type": entity.dxftype(), "layer": entity.dxf.layer}
            
            if entity.dxftype() == "POLYLINE":
                entity_data.update({
                    "vertices": [{"x": v.dxf.location.x, "y": v.dxf.location.y, "z": getattr(v.dxf.location, "z", 0.0), "bulge": getattr(v.dxf, "bulge", 0.0)} for v in entity.vertices],
                    "is_closed": entity.is_closed,
                    "flags": entity.dxf.flags,
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
        except Exception as e:
            print(f"Error processing entity {entity.dxftype()}: {e}")

    # Create a complete JSON-serializable structure
    dxf_data = {
        "header": extents,
        "layers": layers,
        "entities": entities,
    }

    # Write data to JSON
    with open(output_json_path, 'w') as json_file:
        json.dump(dxf_data, json_file, indent=4, default=str)

    print(f"DXF data successfully exported to {output_json_path}")


# Replace with the path to your DXF file and desired JSON output file
dxf_file_path = "./CADexport.dxf"
output_json_path = "./CADexport.json"

# Run the extractor
extract_dxf_data(dxf_file_path, output_json_path)
