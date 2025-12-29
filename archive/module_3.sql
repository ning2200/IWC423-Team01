CREATE TABLE product
( 
	product_id int NOT NULL,
	sku int NOT null,
	product_name varchar(20),
	product_category varchar(20),
	unit_price int NOT NULL,
	unit_qty int NOT NULL,
	CONSTRAINT product_pk PRIMARY KEY (product_id)
);

CREATE TABLE customers
( 
	customer_id int NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	email text NOT null,
	phone char(10) NOT null,
	created_at TIMESTAMP NOT null,
	CONSTRAINT customer_pk PRIMARY KEY (customer_id)
);

CREATE TABLE orders
( 
	order_id int NOT NULL,
	customer_id int NOT NULL,
	store_id int NOT NULL,
	order_ts timestamp NOT NULL,
	total_amount int NOT NULL,
	CONSTRAINT orders_pk PRIMARY KEY (order_id)
	CONSTRAINT orders_fk1 FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
);

CREATE TABLE orderitems 
(
	order_item_id INT NOT NULL,
	order_id INT NOT NULL,
	product_id INT NOT NULL,
	qty INT NOT NULL DEFAULT 0,
	unit_price DECIMAL NOT NULL DEFAULT 0,
	CONSTRAINT order_items_pk PRIMARY KEY (order_item_id),
	CONSTRAINT order_items_fk1 FOREIGN KEY (order_id) REFERENCES orders(order_id),
	CONSTRAINT order_items_fk2 FOREIGN KEY (product_id) REFERENCES product(product_id)
)

CREATE TABLE stores
(
	store_id INT NOT NULL,
	store_name CHAR(100) NOT NULL,
	city CHAR(100) NOT NULL,
	state CHAR(3) NOT NULL,
	CONSTRAINT stores_pk PRIMARY KEY (store_id),
);

INSERT INTO product VALUES (1, 100, 'heat packs', 'lifestyle', 10, 15000);
INSERT INTO product VALUES (2, 101, 'cold packs', 'beer', 6, 20000);
INSERT INTO customers VALUES (1, 'ah hock', 'lim', 'limahhock@hotmail.com', '6512345678', NOW());
INSERT INTO orders VALUES (1, 1, 1, NOW(), 10);
INSERT INTO stores VALUES (1, 'korean_university_store', 'singapore', 'sin');
INSERT INTO orderitems VALUES (1, 1, 1, 2, 5);
INSERT INTO orderitems VALUES (2, 1, 2, 2, 6);
INSERT INTO orderitems VALUES (3, 1, 2, 2, 7);

ALTER TABLE customers 
ADD CONSTRAINT check_singapore_phone_number 
CHECK (phone ~ '^\+?65\s?[6789]\d{7}$');

SELECT * FROM product;
SELECT * FROM orders;
SELECT * FROM customers;
SELECT * FROM stores;
SELECT * FROM orderitems;