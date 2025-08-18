class Joy < ApplicationRecord
  validates :body, :emoji, :lat, :lng, presence: true
  validates :lat, numericality: { in: -90..90 }
  validates :lng, numericality: { in: -180..180 }
  validates :body, length: { maximum: 140 }

  after_create_commit -> { broadcast_prepend_to("joys", target: "joys_list", partial: "joys/joy", locals: { joy: self }) }

  def self.ransackable_attributes(auth_object = nil)
    ["approved", "body", "created_at", "emoji", "id", "id_value", "lat", "likes_count", "lng", "updated_at"]
  end
end
