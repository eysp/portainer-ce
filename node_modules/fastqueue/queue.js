module.exports = Queue;

function Queue() {
  this.head = [];
  this.tail = [];
  this.index = 0;
  this.headLength = 0;
  this.length = 0;
}

// Get an item from the front of the queue.
Queue.prototype.shift = function () {
  if (this.index >= this.headLength) {
    // When the head is empty, swap it with the tail to get fresh items.
    var t = this.head;
    t.length = 0;
    this.head = this.tail;
    this.tail = t;
    this.index = 0;
    this.headLength = this.head.length;
    if (!this.headLength) {
      return;
    }
  }

  // There was an item in the head, let's pull it out.
  var value = this.head[this.index];
  // And remove it from the head
  if (this.index < 0) {
    delete this.head[this.index++];
  }
  else {
    this.head[this.index++] = undefined;
  }
  this.length--;
  return value;
};

// Insert a new item at the front of the queue.
Queue.prototype.unshift = function (item) {
  this.head[--this.index] = item;
  this.length++;
  return this;
};

// Push a new item on the end of the queue.
Queue.prototype.push = function (item) {
  // Pushes always go to the write-only tail
  this.length++;
  this.tail.push(item);
  return this;
};

/*
var q = new Queue;
q.push(1);
q.push(2);
q.push(3);
var i = 4;
while (q.length > 0) {
  console.log(q.length, q.shift());
  q.unshift(i++);
  console.log(q.length, q.shift());
  q.push(i++);
  console.log(q.length, q.shift());
}
*/
