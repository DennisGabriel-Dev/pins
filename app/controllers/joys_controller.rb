class JoysController < ApplicationController
  def index
    @q = Joy.where(approved: true).ransack(params[:q])
    @joys = @q.result.order(created_at: :desc).limit(100)
    @joy = Joy.new

    respond_to do |format|
      format.html
      format.json { render json: @joys.select(:id, :body, :emoji, :lat, :lng, :likes_count, :created_at) }
    end
  end

  def show
    @joy = Joy.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: @joy.slice(:id, :body, :emoji, :lat, :lng, :likes_count, :created_at) }
    end
  end

  def create
    @joy = Joy.new(joy_params.merge(approved: true))

    if @joy.save
      respond_to do |format|
        format.html { redirect_to root_path, notice: "Alegria criada!" }
        format.json { render json: @joy, status: :created }
      end
    else
      respond_to do |format|
        format.html do
          @q = Joy.where(approved: true).ransack(params[:q])
          @joys = @q.result.order(created_at: :desc).limit(100)
          render :index, status: :unprocessable_entity
        end
        format.json { render json: { errors: @joy.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  private

  def joy_params
    params.require(:joy).permit(:body, :emoji, :lat, :lng)
  end
end
