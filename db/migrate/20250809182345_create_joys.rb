class CreateJoys < ActiveRecord::Migration[8.0]
  def change
    create_table :joys do |t|
      t.string :body
      t.string :emoji
      t.decimal :lat, precision: 9, scale: 6
      t.decimal :lng, precision: 9, scale: 6
      t.integer :likes_count, default: 0
      t.boolean :approved, default: true

      t.timestamps
    end
  end
end
