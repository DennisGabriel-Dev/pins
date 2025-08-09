class Joy < ApplicationRecord
  validates :body, :emoji, :lat, :lng, presence: true
  validates :lat, numericality: { in: -90..90 }
  validates :lng, numericality: { in: -180..180 }
  validates :body, length: { maximum: 140 }
end
