CREATE TABLE bodegas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE sucursales (
  id SERIAL PRIMARY KEY,
  bodega_id INTEGER NOT NULL REFERENCES bodegas(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE monedas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE materiales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  codigo_producto VARCHAR(15) NOT NULL UNIQUE,
  nombre_producto VARCHAR(50) NOT NULL,
  bodega_id INTEGER NOT NULL REFERENCES bodegas(id),
  sucursal_id INTEGER NOT NULL REFERENCES sucursales(id),
  moneda_id INTEGER NOT NULL REFERENCES monedas(id),
  precio NUMERIC(12,2) NOT NULL,
  descripcion TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE producto_materiales (
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materiales(id) ON DELETE CASCADE,
  PRIMARY KEY(producto_id, material_id)
);

INSERT INTO bodegas (nombre) VALUES ('Bodega Central'), ('Bodega Norte');
INSERT INTO sucursales (bodega_id, nombre) VALUES (1,'Sucursal La Cruz'), (1,'Sucursal La Calera'), (2,'Sucursal Quillota');
INSERT INTO monedas (codigo, nombre) VALUES ('CLP','Peso Chileno'), ('USD','Dólar');
INSERT INTO materiales (nombre) VALUES ('Plastico'), ('Metal'), ('Madera'), ('Vidrio'), ('Textil');
