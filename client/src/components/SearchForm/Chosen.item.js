import React from 'react';
import './styles.css';

function ChosenItem ({ item, itemClean, funcDelete }) {
  return (
    <div className="chosen-item item-green-border">
      <div className="tooltip">
        {itemClean}
        <span class="tooltiptext">{item}</span>
      </div>

      <div className="item_delete">
        <span className="item_delete_button"
          role="img"
          aria-label="delete"
          onClick={() => funcDelete(item)}>x</span>
      </div>

    </div>
  );
}

export default ChosenItem;