# 📍 Pins - Mapa de Alegrias

Um aplicativo web interativo que permite aos usuários compartilhar momentos de alegria com localização geográfica em um mapa colaborativo.

## ✨ Funcionalidades

- 🗺️ **Mapa Interativo**: Visualize todas as alegrias compartilhadas em um mapa usando OpenStreetMap
- 📍 **Geolocalização**: Adicione pins com coordenadas precisas (latitude e longitude)
- 😊 **Alegrias Personalizadas**: Compartilhe mensagens de até 140 caracteres com emojis
- ❤️ **Sistema de Curtidas**: Interaja com as alegrias de outros usuários
- 🎲 **Modo Surpresa**: Descubra alegrias aleatórias no mapa
- 📱 **Design Responsivo**: Interface adaptada para desktop e mobile
- ⚡ **Tempo Real**: Atualizações instantâneas com Turbo Streams

## 🛠️ Stack Tecnológico

- **Backend**: Ruby on Rails 8.0.2
- **Banco de Dados**: PostgreSQL
- **Frontend**: Stimulus + Turbo (Hotwire)
- **Mapas**: Leaflet.js + OpenStreetMap
- **Estilização**: CSS puro com design responsivo
- **Deploy**: Docker + Kamal
- **Cache**: Solid Cache
- **Jobs**: Solid Queue
- **WebSockets**: Solid Cable

## Imagens do Projeto
![Logo do Pins](./app/assets/images/screenshoot_app.png)

## 🚀 Instalação e Configuração

### Pré-requisitos

- Ruby 3.1+
- PostgreSQL
- Node.js (para assets)
- Docker (opcional, para deploy)

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd pins
   ```

2. **Instale as dependências**
   ```bash
   bundle install
   ```

3. **Configure o banco de dados**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Inicie o servidor**
   ```bash
   rails server
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 📖 Como Usar

### Adicionando uma Alegria

1. Clique no botão flutuante "+" no canto superior direito
2. Digite sua mensagem de alegria (máximo 140 caracteres)
3. Escolha um emoji para representar sua alegria
4. Clique no mapa para definir a localização
5. Clique em "Compartilhar Alegria"

### Navegando no Mapa

- **Zoom**: Use a roda do mouse ou os controles de zoom
- **Navegação**: Arraste o mapa para mover
- **Marcadores**: Clique nos pins para ver detalhes
- **Surpresa**: Use o botão "🎲 Surpresa" para descobrir alegrias aleatórias

### Interagindo com Alegrias

- Clique em qualquer pin no mapa para ver os detalhes
- Use o sistema de curtidas para interagir com as alegrias
- Visualize a lista de localizações na barra lateral

## 🏗️ Estrutura do Projeto

```
app/
├── controllers/
│   └── joys_controller.rb      # Controlador principal
├── models/
│   └── joy.rb                  # Modelo de dados
├── views/
│   └── joys/                   # Views da aplicação
├── javascript/
│   └── controllers/
│       └── map_controller.js   # Controller Stimulus para o mapa
└── assets/
    └── stylesheets/
        └── application.css     # Estilos da aplicação
```

## 🗄️ Modelo de Dados

### Joy (Alegria)

- `body`: Texto da alegria (máximo 140 caracteres)
- `emoji`: Emoji representativo
- `lat`: Latitude (precisão de 6 casas decimais)
- `lng`: Longitude (precisão de 6 casas decimais)
- `likes_count`: Contador de curtidas
- `approved`: Status de aprovação (padrão: true)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL=postgresql://usuario:senha@localhost/pins_development
```

### Executando Testes

```bash
rails test
```

### Linting e Análise de Código

```bash
# RuboCop
bundle exec rubocop

# Brakeman (análise de segurança)
bundle exec brakeman
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
