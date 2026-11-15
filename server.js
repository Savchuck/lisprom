const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const bodyParser = require('body-parser');
const PORT = "8081";
const HOSTNAME = "localhost";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Savchuc25@",
    database: "lisprom"
})
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret', // Секретний ключ для підпису cookie
  resave: true, // Перезберігання сесії при кожному запиті
  saveUninitialized: false // Зберігання сесії лише при зміні
}));


app.delete('/delmessage/:id', (req, res) => {
  const messageId = req.params.id;
  db.query('DELETE FROM message WHERE id_message = ?', [messageId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.sendStatus(200);
  });
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});
app.get('/data', (req, res)=>{
  let sql = "SELECT cname, id  FROM category";
          db.query(sql, (err, data) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error fetching data');
            } else {
              res.json(data);
            }
          });
});

app.get('/getPrice', (req, res) => {
  const { pname, detail } = req.query;
  const query = 'SELECT price FROM product WHERE pname = ? AND detail = ?';

  console.log(`Query parameters - pname: ${pname}, detail: ${detail}`);
  db.query(query, [pname.trim() + " ", detail], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Database query error' });
      }
      if (results.length > 0) {
          res.json({ price: results[0].price });
      } else {
          res.status(404).json({ error: 'Product not found' });
      }
  });
});

app.get('/message', (req, res)=>{
  let sql = "SELECT id_message, text_message, full_name, email FROM message";
          db.query(sql, (err, data) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error fetching data');
            } else {
              res.json(data);
            }
          });
});

app.get('/catalog', (req, res)=>{
  res.sendFile(__dirname + '/catalog.html');
});

app.get(encodeURI('/catalog/:category'), (req, res)=>{
  
  const category = req.params.category;
  res.render(__dirname + '/product.ejs', {product: category});
});
app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html');
});
app.get('/login', (req, res)=>{
  res.sendFile(__dirname + '/login.html');
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
      if (err) {
          res.status(500).send('Помилка при перевірці входу');
      } else {
          if (results.length > 0) {
            const userId = results[0].idusers;
            const userFullName = results[0].full_name;
            const userEmail= results[0].email;
            const userStatus = results[0].user_status;
            const userPhone= results[0].phone;

            req.session.userId = userId;
            req.session.userFullName = userFullName;
            req.session.userEmail = userEmail;
            req.session.userStatus = userStatus;
            req.session.userPhone = userPhone;
            console.log('Отриманий ідентифікатор користувача:', userId);
            console.log(userFullName);
            res.status(200).json({ loggedIn: true });
            
          } else {
            res.status(401).json({ error: 'Неправильний email або пароль' });
          }
      }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Помилка при виході');
    }
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 0
    });
    res.redirect('/login');
  });
});

app.get('/check_login_status', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId , userStatus: req.session.userStatus, userFullName: req.session.userFullName, userEmail: req.session.userEmail, userPhone: req.session.userPhone});
  } else {
    res.json({ loggedIn: false });
  }
});
app.get('/users/:idUsers', (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  
  const userId = req.params.idUsers;
  console.log(":: "+ userId, "  ::  "+ req.session.userId + "  ::  " + req.session.userStatus);
  if(userId === req.session.userStatus){
    
      if(req.session.userStatus==='admin'){
        
        res.sendFile(__dirname + '/admin.html');
      }
      else if(req.session.userStatus==='driver'){
        
        res.redirect('/users/driver/orders');
      }
  }
  else if(req.session.userStatus==='user'){
    const sql = 'SELECT * FROM users WHERE idusers = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            res.status(500).send('Помилка при отриманні даних користувача');
        } else {
            if (results.length > 0) {
                const user = results[0];
                
                
                res.render(__dirname + '/user.ejs', {username: user.full_name, userId: user.idusers, userEmail: user.email, userPhone: user.phone});
            } else {
                res.status(404).send('Користувач не знайдений');
            }
        }
    });
      }
  else{
    res.redirect("/login");
  }
  
});

app.post('/update-user', (req, res) => {
  const { full_name, phone, email } = req.body;
  const sql = 'UPDATE users SET full_name = ?, email = ?, phone = ? WHERE idusers = ' + req.session.userId;
  console.log(sql);
  db.query(sql, [full_name, email, phone], (err, result) => {
    if (err) throw err;
    res.send('User updated successfully');
  });
});


app.post('/delete-driver', (req, res) => {
  const { name, email } = req.body;
  const sql = 'DELETE FROM users WHERE full_name = ? AND email = ? AND user_status = "driver"';
  db.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    res.send('Driver delete successfully');
  });
});



app.get('/users/:idUsers/orders', (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  
  const userId = req.params.idUsers;
  if(userId === req.session.userStatus){
    if(req.params.idUsers === 'admin' ) {
      const sql = 'SELECT * FROM orders';
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error retrieving orders:', err);
          return res.status(500).send('Error retrieving orders');
        }
        const groupedOrders = results.reduce((acc, order) => {
          if (!acc[order.idorder]) {
            acc[order.idorder] = {
              idorder: order.idorder,
              orders: []
            };
          }
          acc[order.idorder].orders.push(order);
          return acc;
        }, {});
  
        const ordersArray = Object.values(groupedOrders);
        

        res.render(__dirname + '/admin_orders.ejs', { orders: ordersArray });
      });
  
    }
    else if(req.params.idUsers === 'driver'){
      const sql = `
      SELECT o.*, p.pname, p.detail FROM orders o
      JOIN product p ON o.idproduct = p.id
      WHERE o.status <>	'Підтвердження' AND o.status <> ''
      `;
  
      db.query(sql, (err, results) => {
          if (err) {
              console.error('Помилка при отриманні даних про товари для водія:', err);
              res.status(500).send('Помилка при отриманні даних про товари для водія.');
              return;
          }
  
          // Групування замовлень за ідентифікатором
          const groupedOrders = results.reduce((acc, order) => {
              if (!acc[order.idorder]) {
                  acc[order.idorder] = {
                      idorder: order.idorder,
                      orders: []
                  };
              }
              acc[order.idorder].orders.push(order);
              return acc;
          }, {});
  
          // Конвертуємо об'єкт у масив замовлень
          const ordersArray = Object.values(groupedOrders);
          // Відправляємо дані на сторінку водія для відображення
          res.render(__dirname + '/driver.ejs', { orders: ordersArray });
      });
    }
  }

    else if(req.session.userStatus==='user'){
      const userSql = 'SELECT * FROM users WHERE idusers = ?';
    db.query(userSql, [req.session.userId], (err, userResults) => {
      if (err) {
        return res.status(500).send('Помилка при отриманні даних користувача');
      } else if (userResults.length === 0) {
        return res.status(404).send('Користувач не знайдений');
      }

      const user = userResults[0];
      const sql = 'SELECT o.*, p.pname, p.detail FROM orders o JOIN product p ON o.idproduct = p.id WHERE username = (SELECT full_name FROM users WHERE idusers = '  + req.session.userId + ")";
      db.query(sql, (err, results) => {
        if (err) {
            console.error('Помилка при отриманні даних про товари для водія:', err);
            res.status(500).send('Помилка при отриманні даних про товари для водія.');
            return;
        }

        // Групування замовлень за ідентифікатором
        const groupedOrders = results.reduce((acc, order) => {
            if (!acc[order.idorder]) {
                acc[order.idorder] = {
                    idorder: order.idorder,
                    orders: []
                };
            }
            acc[order.idorder].orders.push(order);
            return acc;
        }, {});

        // Конвертуємо об'єкт у масив замовлень
        const ordersArray = Object.values(groupedOrders);

        

        // Відправляємо дані на сторінку водія для відображення
        res.render(__dirname + '/user-orders.ejs', { orders: ordersArray, username: user.full_name, userId: user.idusers, userEmail: user.email, userPhone: user.phone });
      });
    });
    }
    else{
      res.redirect("/login");
    }
  
});


app.post('/updateOrderStatus/:orderId', (req, res) => {
  const { orderId } = req.params;
  const newStatus = req.body.status;
  console.log(`Updating order status for order ID: ${orderId} to ${newStatus}`);
  // Update the status in the database
  const sql = `
    UPDATE orders
    SET status = ?
    WHERE idorder = ?
  `;
  db.query(sql, [newStatus, orderId], (err, results) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).send('Error updating order status');
    }
    res.sendStatus(200); // Send success response
  });
});

app.get('/parameters/:category', (req, res) => {
  const category = req.params.category;

  const sqlGetCategoryId = 'SELECT id FROM category WHERE cname = ?';
    db.query(sqlGetCategoryId, [category], (err, results) => {
        if (err) {
            console.error('Error getting category ID:', err);
            res.status(500).send('Error getting category ID');
            return;
        }
        if (results.length === 0) {
          res.status(404).send('Category not found');
          return;
        }
        const categoryId = results[0].id;
        console.log(categoryId);
        const sql = `
        SELECT
        GROUP_CONCAT(DISTINCT SUBSTRING_INDEX(p.detail, '*', 1) ORDER BY SUBSTRING_INDEX(p.detail, '*', 1)) AS height,
        ${'GROUP_CONCAT(DISTINCT CASE WHEN p.detail LIKE "%*%*%" THEN SUBSTRING_INDEX(SUBSTRING_INDEX(p.detail, "*", 2), "*", -1) ELSE NULL END ORDER BY SUBSTRING_INDEX(SUBSTRING_INDEX(p.detail, "*", 2), "*", -1))'} AS width,
        GROUP_CONCAT(DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(p.detail, '*', 3), '*', -1) ORDER BY SUBSTRING_INDEX(SUBSTRING_INDEX(p.detail, '*', 3), '*', -1)) AS length
    FROM
        product p
    WHERE
        p.idcategory = ?
        AND p.detail IS NOT NULL
        AND p.detail != ''
            `;
    db.query(sql, [categoryId], (err, results) => {
      if (err) {
        console.error('Error fetching product parameters:', err);
        res.status(500).send('Error fetching product parameters');
        return;
    }

    if (results.length === 0) {
        res.json({ parameters: [] }); // Return an empty array if no parameters found
        return;
    } 
      const parameters = results.map(result => ({
        width: results[0].width ? results[0].width.split(',') : [],
        height: results[0].height.split(','),
        length: results[0].length.split(',')
      }));
          res.json({ parameters, categoryId} );
      
  });
    });
  
});




let orders = [];
app.get('/order', (req, res)=>{
  res.sendFile(__dirname + '/order.html');
});

app.post('/saveOrder', (req, res) => {
  const orderData = req.body;
  orders.push(orderData);
  res.sendStatus(200);
});

// Обробник для отримання даних замовлення
app.get('/getOrder', (req, res) => {
  res.json(orders);
  orders = [];
});




app.get('/getProductId', (req, res) => {
  const pname = req.query.pname;

  const sql = 'SELECT id FROM product WHERE pname = ?';
  db.query(sql, [pname], (err, results) => {
      if (err) {
          console.error('Помилка при отриманні id товару:', err);
          res.status(500).send('Помилка при отриманні id товару.');
          return;
      }

      if (results.length > 0) {
          const id = results[0].id;
          res.json({ id });
      } else {
          res.status(404).send('Товар з вказаною назвою не знайдено.');
      }
  });
});
// Обробник для обробки форми оформлення замовлення
// Додамо маршрут для обробки збереження замовлення
app.post('/save', async (req, res) => {
  const { username, number, email, address, products } = req.body;
  products.shift(); // видаляє перший рядок (назва, кількість тощо)
  console.log('Дані про товари замовлення:', products);
  const orderId = uuidv4();
  const orderData = [];
  let status = "Підтвердження";
  try {
      for (const product of products) {
          const { pname, quantity, details } = product;

          const rows = await db.promise().query('SELECT id FROM product WHERE pname = ? AND detail = ?', [pname + " ", details]);
          console.log("::: ");
          console.log(rows);
          console.log("name: ", pname)
          console.log(" :::");
          if (rows.length === 0) {
              return res.status(404).send(`Товар з назвою "${pname}" не знайдено.`);
          }

          const productId = rows[0][0].id;

          console.log("productID: ", productId)
          
          const sql = 'INSERT INTO orders (idorder, idproduct, quantity, username, email, address, number, status) VALUES (?)';
      await db.promise().query(sql, [[orderId, productId, quantity, username, email, address, number, status]]);
      console.log('Замовлення успішно збережено.');
      }

      
      res.sendStatus(200);
  } catch (error) {
      console.error('Помилка при збереженні замовлення:', error);
      return res.status(500).send('Помилка при обробці замовлення.');
  }
});





app.get('/register', (req, res)=>{
  res.sendFile(__dirname + '/register.html');
});

app.get('/users/admin/drivers', (req, res)=>{
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  console.log(req.session.userStatus);
  const sql2 = 'SELECT * FROM users WHERE user_status = "driver"';
        db.query(sql2, (err, results) => {
          if (err) {
            console.error('Error retrieving orders:', err);
            return res.status(500).send('Error retrieving orders');
          }
          const driversArray = Object.values(results);
          console.log(driversArray);
          res.render(__dirname + '/drivers_add.ejs', {drivers: driversArray});
        });
});



app.post('/register', (req, res) => {
  const { full_name, email, password, repeat_password} = req.body;
  // Перевірка, чи співпадають пароль і повторний пароль
  let user_status;
  if(req.session.userStatus === 'admin'){
    user_status = "driver";
  }
  else{
    user_status = "user"
  }
  if (password !== repeat_password) {
    return res.status(400).send('Пароль і повторний пароль не співпадають');
  }

  // Вставка нового користувача в таблицю "users"
  const newUser = { full_name, email, password, user_status};
  const sql = 'INSERT INTO users SET ?';
  db.query(sql, newUser, (err, result) => {
    if (err) throw err;
    console.log('Новий користувач доданий до бази даних');
    res.send('Реєстрація успішна');
  });
});


app.post('/send_message', (req, res) => {
  const { full_name, email, text_message} = req.body;
  

  // Вставка нового користувача в таблицю "users"
  const newMessage = { text_message, full_name, email};
  const sql = 'INSERT INTO message SET ?';
  db.query(sql, newMessage, (err, result) => {
    if (err) throw err;
    console.log('Нове повідомлення додане до бази даних');
    res.send('Надсилання повідомлення успішна');
  });
});


app.use((req,res)=>{
  res.status(404).send('Not found');
});


app.listen(PORT, HOSTNAME,() => {
  console.log("Listening...");
})