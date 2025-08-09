begin
  connection = ActiveRecord::Base.connection
  has_joys_table = connection.table_exists?(:joys)
rescue StandardError
  has_joys_table = false
end

unless has_joys_table
  puts "[seeds] Tabela 'joys' não existe ainda. Rode `bin/rails db:migrate` antes de `db:seed`."
else
  joys_seed = [
    # São Paulo
    { body: "Café perfeito na padaria da esquina", emoji: "☕️", lat: -23.5505, lng: -46.6333, likes_count: 5 },
    { body: "Garçom lembrou meu nome", emoji: "😊", lat: -23.5570, lng: -46.6490, likes_count: 3 },
    { body: "Pôr do sol bonito na Paulista", emoji: "🌇", lat: -23.5614, lng: -46.6559, likes_count: 8 },
    { body: "Ônibus passou na hora certa", emoji: "🚌", lat: -23.5432, lng: -46.6290, likes_count: 2 },

    # Rio de Janeiro
    { body: "Brisa na orla de Copacabana", emoji: "🌊", lat: -22.9711, lng: -43.1822, likes_count: 7 },
    { body: "Elogio inesperado no trabalho", emoji: "✨", lat: -22.9068, lng: -43.1729, likes_count: 6 },
    { body: "Água de coco geladinha", emoji: "🥥", lat: -22.9833, lng: -43.2045, likes_count: 4 },
    { body: "Música ao vivo na praça", emoji: "🎶", lat: -22.9139, lng: -43.2003, likes_count: 3 },

    # Belo Horizonte
    { body: "Pão de queijo quentinho", emoji: "🧀", lat: -19.9191, lng: -43.9386, likes_count: 9 },
    { body: "Céu rosa no fim da tarde", emoji: "🌅", lat: -19.9227, lng: -43.9451, likes_count: 4 },
    { body: "Gentileza no trânsito", emoji: "🚗", lat: -19.9150, lng: -43.9300, likes_count: 2 },
    { body: "Chuva que refrescou a cidade", emoji: "🌧️", lat: -19.9100, lng: -43.9400, likes_count: 1 },

    # Porto Alegre
    { body: "Cheiro de churrasco na rua", emoji: "🍖", lat: -30.0346, lng: -51.2177, likes_count: 5 },
    { body: "Caminhada no Parque da Redenção", emoji: "🌳", lat: -30.0330, lng: -51.2140, likes_count: 4 },
    { body: "Café com amigo antigo", emoji: "☕️", lat: -30.0380, lng: -51.2200, likes_count: 6 },
    { body: "Livro bom encontrado por acaso", emoji: "📚", lat: -30.0365, lng: -51.2100, likes_count: 3 },

    # Recife
    { body: "Brisa no Marco Zero", emoji: "🌬️", lat: -8.0632, lng: -34.8711, likes_count: 7 },
    { body: "Som de frevo na rua", emoji: "🎺", lat: -8.0476, lng: -34.8770, likes_count: 4 },
    { body: "Bolo de rolo na sobremesa", emoji: "🍰", lat: -8.0500, lng: -34.8800, likes_count: 5 },
    { body: "Bom dia de desconhecido", emoji: "👋", lat: -8.0550, lng: -34.8750, likes_count: 2 }
  ]

  created_count = 0
  joys_seed.each do |attrs|
    attrs[:approved] = true
    joy = Joy.where(body: attrs[:body], lat: attrs[:lat], lng: attrs[:lng]).first_or_initialize
    if joy.new_record?
      joy.assign_attributes(attrs)
      joy.save!
      created_count += 1
    end
  end

  puts "[seeds] Finished creating seeds."
end
