import sqlalchemy as sa
import geoalchemy2 as gsa
from geoalchemy2.shape import to_shape
import json
from shapely.geometry import shape, Polygon, mapping
from shapely import intersection
from pathlib import Path
import config

# инициализация БД
eng = sa.create_engine(config.DB_URI)
metadata = sa.MetaData(bind=eng, schema='app')
table = sa.Table(
    "points",
    metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("name", sa.String(1)),
    sa.Column("geometry", gsa.Geometry(geometry_type='POLYGON', srid=4326)),
)
with eng.begin() as conn:
    conn.execute('create schema if not exists app')
metadata.create_all()

# инициализация исходных данных
input_data = [
    {**i['properties'], 'geometry': shape(i['geometry']).geoms[0].wkt} 
    for i in json.loads(Path('input_data.geojson').read_bytes())['features']
]
with eng.begin() as conn:
    if conn.execute(sa.select(sa.func.count()).select_from(table)).scalar() == 0:
        conn.execute(
            sa.insert(table),
            input_data
        )

def get_intersection(polygons):
    layers = []
    for p in polygons:
        layers.append(Polygon(p))
    return mapping(intersection(*layers))

def to_geojson(records):
    features = []
    polygons = []
    for r in records:
        r = dict(r)
        geom = r.pop('geometry')
        features.append({'type': 'Feature', 'properties': r, 'geometry': json.loads(geom)})
        polygons.append(json.loads(geom)['coordinates'][0])
    return {'type': 'FeatureCollection', 'features': features, 'properties': {'intersection': get_intersection(polygons)} }

def get_all():
    with eng.connect() as conn:
        cur = conn.execute(sa.select([table.c.id, table.c.name, table.c.geometry.ST_AsGeoJSON().label('geometry')]))
        return to_geojson(cur)