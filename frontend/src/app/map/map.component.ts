import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../services/map.service';
import { LayersService } from '../services/layers.service';
import { GeoJsonObject } from 'geojson';

interface Colors {
  red: string;
  blue: string;
  yellow: string;
}

interface LayerData {
  type: string;
  features: GeoJsonObject | GeoJsonObject[] | undefined;
  properties: {
    [x: string]: any;
  };
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  constructor(
    private mapService: MapService,
    private layerService: LayersService
  ) {}

  private initMap(): void {
    this.mapService.map = L.map('map', {
      center: [55.75, 37.61],
      zoom: 12,
    });
  }

  private initBaseLayer(): void {
    this.mapService.map.addLayer(this.layerService.tiles);
  }

  private initDataLayer(): void {
    this.layerService.fetchLayer().subscribe(() => {
      this.onSelected('A|B');
    });
  }

  private clearPolygonLayers(): void {
    this.mapService.map.eachLayer((layer: L.Layer) => {
      const isLayerPolygon: boolean = layer instanceof L.Polygon;

      if (isLayerPolygon) {
        this.mapService.map.removeLayer(layer);
      }
    });
  }

  public onSelected(variant: string | undefined): void {
    this.clearPolygonLayers();

    const colors: Colors = {
      red: 'red',
      blue: 'blue',
      yellow: 'yellow',
    };

    this.layerService.fetchLayer().subscribe((data: any) => {
      if (variant === 'A&B') {
        const layer = L.geoJSON(data.properties.intersection as GeoJsonObject, {
          style: { color: colors.yellow, fillOpacity: 0.5, weight: 3 },
        });

        this.mapService.map.addLayer(layer);
      } else {
        data.features.forEach((layerData: GeoJsonObject & LayerData) => {
          const layerColor =
            layerData.properties['name'] === 'A' ? colors.red : colors.blue;
          const layer = L.geoJSON(layerData, {
            style: { color: layerColor, fillOpacity: 0.5, weight: 3 },
          });

          if (
            (layerData.properties['name'] === 'A' && variant === 'A') ||
            (layerData.properties['name'] === 'B' && variant === 'B')
          ) {
            this.mapService.map.addLayer(layer);
          } else if (variant === 'A|B') {
            const layer = L.geoJSON(layerData, {
              style: {
                color: layerColor,
                fillOpacity: 0.5,
                weight: 3,
              },
            });

            this.mapService.map.addLayer(layer);
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initBaseLayer();
    this.initDataLayer();
  }
}
