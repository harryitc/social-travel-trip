
#!/bin/bash 
#Author: chuongtv 
#last Updated: 27/09/2023 09:26


#cai dat nest cli neu chua co; neu co roi dong dong nay lai
# nvm install 16.13.1
# nvm use 16.13.1
# npm i -g @nestjs/cli

# di chuyen ra duong dan chua file general
# va thuc hien chay lenh

# Kiểm tra số lượng tham số
if [ "$#" -ne 2 ]; then
    echo "Sử dụng: ./create-nest-component.sh [Tên thư mục] [Tên module]"
    exit 1
fi

# Kiểm tra xem thư mục đã tồn tại chưa
if [ -d "$folder_name" ]; then
    echo "Thư mục $folder_name đã tồn tại. Hủy bỏ."
    exit 1
fi

#thu muc goc
main_dir=$PWD
# Lấy tên thư mục và tên module từ tham số dòng lệnh
folder_name=$1
module_name=$2

# Hiển thị một bản xem trước của cấu trúc thư mục và các tệp sẽ được tạo
echo "Xem trước các thay đổi (không tạo thay đổi thực tế trên hệ thống tệp):"
echo "Sẽ tạo trong src/modules:"
echo "$folder_name/"
echo "├── ${module_name}.module.ts"
echo "├── ${module_name}.controller.ts"
echo "├── ${module_name}.service.ts"
echo "├── repositories/"
echo "├── model/"
echo "├── dto/"
echo "├── proxy/"
echo "├── commands/"
# echo "│   └── ${module_name}.command.ts"
echo "├── queries/"
# echo "│   └── ${module_name}.query.ts"
echo "└── events/"
# echo "    └── ${module_name}.event.ts"

# Hỏi người dùng xác nhận để tiếp tục
read -p "Bạn có muốn tiếp tục với các thay đổi này? (yes/no): " confirmation

# Kiểm tra giá trị người dùng nhập vào
if [ "$confirmation" != "yes" ]; then
    echo "Hủy bỏ. Không tạo thay đổi nào đã thực hiện."
    exit 1
fi

# Tạo thư mục nếu người dùng xác nhận
# di chuyen den thu muc goc cua module
cd $main_dir/src/modules

mkdir $folder_name

# Tạo thư mục don
mkdir -p $folder_name/repositories
mkdir -p $folder_name/model
mkdir -p $folder_name/dto
mkdir -p $folder_name/proxy

# di chuyen den thu muc cha
cd $folder_name

# Sử dụng NestJS CLI để tạo module, controller, service, CQRS command và query
npx nest generate module $module_name --flat
npx nest generate controller $module_name --flat --no-spec
npx nest generate service $module_name --flat --no-spec

# Tạo thư mục "commands" và tệp command
mkdir commands
# npx nest generate cqrs:command commands/${module_name}.command

# Tạo thư mục "queries" và tệp query
mkdir queries
# npx nest generate cqrs:query queries/${module_name}.query 

# Tạo thư mục "events" và tệp event
mkdir events
# npx nest generate cqrs:event events/${module_name}.event

# Báo cáo rằng các thay đổi đã được thực hiện
echo "Đã tạo thư mục $folder_name và các thành phần trong module $module_name, bao gồm CQRS command, CQRS query và event."
