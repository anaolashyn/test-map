import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { latLng, tileLayer, Map, icon, marker, Marker } from 'leaflet';

interface Data {
  name: string;
  children?: Data[];
  id?: number;
  parent_id?: number;
}

interface nodeMarker {
  nodeName: string;
  markerInstance: Marker;
}

const DATA: Data[] = [
  {
    "id": 1,
    "name": "Parent 1",
    "children": [
      {
        "name": "Child 1",
        "parent_id": 1
      },
      {
        "name": "Child 2",
        "parent_id": 1
      }
    ]
  },
  {
    "id": 2,
    "name": "Parent 2",
    "children": [
      {
        "name": "Child 3",
        "parent_id": 2
      },
      {
        "name": "Child 4",
        "parent_id": 2
      }
    ]
  },
  {
    "id": 3,
    "name": "Parent 3",
    "children": [
      {
        "name": "Child 5",
        "parent_id": 3
      },
      {
        "name": "Child 6",
        "parent_id": 3
      }
    ]
  }

];

const DATA_ACTIVE: Data[] = [];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: number;
  parent_id: number;
}

@Component({
  selector: 'tree-flat',
  templateUrl: 'tree-flat.html',
  styleUrls: ['tree-flat.css'],
})
export class TreeFlat {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 12,
    center: latLng([50.45, 30.45])
  };

  map: Map;
  markers: nodeMarker[] = [];
  onMapReady(map: Map) {
    this.map = map;
  }

  add(node) {
    if (node.id) {
      let parentIndex = this.dataSource.data.findIndex(el => el.id === node.id);
      this.dataSource.data[parentIndex].children.forEach(element => {
        let newParentNode = { name: element.name, parent_id: node.id };
        this.dataSourceActive.data.push(newParentNode);
        this.dataSource.data[parentIndex].children = this.dataSource.data[parentIndex].children.filter(el => el.parent_id !== node.id);

        let newMarker: Marker = marker(latLng([Math.random() * (50.5 - 50.38) + 50.38, Math.random() * (30.58 - 30.40) + 30.40]), {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',

          }), title: element.name
        });
        let newNodeMarker = {
          nodeName: element.name,
          markerInstance: newMarker
        }
        this.markers.push(newNodeMarker);
        newMarker.addTo(this.map).on('click', ((e) => {
          let markerIndex = this.markers.findIndex(el => el.nodeName === element.name);
          let deletedMarker = this.markers[markerIndex].markerInstance;
          deletedMarker.removeFrom(this.map);
          this.markers.splice(markerIndex, 1);
          this.delete(element);
        }));

      });

      this.dataSource.data = this.dataSource.data.filter(el => el.id !== node.id);

    } else {
      let newNode = { name: node.name, parent_id: node.parent_id };
      let index = this.dataSource.data.findIndex(el => el.id === node.parent_id);
      this.dataSource.data[index].children = this.dataSource.data[index].children.filter(el => el.name !== node.name);
      if (this.dataSource.data[index].children.length === 0) {
        this.dataSource.data.splice(index, 1);
      }
      this.dataSourceActive.data.push(newNode);
      let newMarker: Marker = marker(latLng([Math.random() * (50.5 - 50.38) + 50.38, Math.random() * (30.58 - 30.40) + 30.40]), {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        }), title: node.name
      });
      let newNodeMarker = {
        nodeName: node.name,
        markerInstance: newMarker
      }
      this.markers.push(newNodeMarker);
      newMarker.addTo(this.map).on('click', ((e) => {
        let markerIndex = this.markers.findIndex(el => el.nodeName === node.name);
        let deletedMarker = this.markers[markerIndex].markerInstance;
        deletedMarker.removeFrom(this.map);
        this.markers.splice(markerIndex, 1);
        this.delete(node);
      }));
    }
    this.dataSourceActive.data.sort((a, b) => { return a.name > b.name ? 1 : -1 });
    let data = this.dataSourceActive.data
    this.dataSourceActive.data = [];
    this.dataSourceActive.data = data;
    data = this.dataSource.data
    this.dataSource.data = [];
    this.dataSource.data = data;
  }
  delete(node) {
    this.dataSourceActive.data = this.dataSourceActive.data.filter(el => el.name !== node.name);
    let index = this.dataSource.data.findIndex(el => el.id === node.parent_id);
    let newNode = { name: node.name, parent_id: node.parent_id };
    if (index === -1) {
      let newParent = { name: 'Parent ' + node.parent_id, id: node.parent_id, children: [newNode] };
      this.dataSource.data.push(newParent);
      this.dataSource.data.sort((a, b) => { return a.id - b.id });
    } else {
      this.dataSource.data[index].children.push(newNode);
      this.dataSource.data[index].children.sort((a, b) => { return a.name > b.name ? 1 : -1 });
    }
    let data = this.dataSource.data
    this.dataSource.data = [];
    this.dataSource.data = data;
    let markerIndex = this.markers.findIndex(el => el.nodeName === node.name);
    let deletedMarker = this.markers[markerIndex].markerInstance;
    deletedMarker.removeFrom(this.map);
    this.markers.splice(markerIndex, 1);

  }

  private _transformer = (node: Data, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      parent_id: node.parent_id
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  dataSourceActive = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = DATA;
    this.dataSourceActive.data = DATA_ACTIVE;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
