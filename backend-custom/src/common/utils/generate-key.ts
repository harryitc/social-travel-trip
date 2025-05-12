import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import * as  _ from 'lodash';

export class SinhKeyUtil {

    /**
     * @author Bình
     * @description sinh key tut bên eduzaa
     * @param length chiều dài muốn sinh
     * @param prefix từ khoá mặc định đằng trước
     */
    public static readonly GENERATE = (length, prefix = '') => {
        let char = '',
            RANDOM_CHARACTER = [
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            ];
        for (let i = 0; i < length; i++) {
            char += _.sample(RANDOM_CHARACTER);
        }
        return prefix + char;
    }

    /**
    * @author Bình
    * thời gian[string|Date,format:YYYYMMDDHHmm] + id[string|number] - uuid (YYYYMMDDHHmm+id-uuid)
    * ví dụ: 
    * 201925941530202-23232-23123123
    */
    public static hashUIID(id: string = '', thoi_gian: string = moment().format('YYYYMMDDHHmm')) {
        try {
            if (!thoi_gian) {
                throw new Error('Thiếu thời gian');
            }

            /**
             * kiểu string
             */
            if (typeof thoi_gian === 'string') {
                if (!moment(thoi_gian, 'YYYYMMDDHHmm', true).isValid()) {
                    throw new Error('Thời gian phải là string[format:YYYYMMDDHHmm]');
                }
            } else {
                throw new Error('thoi gian phải là format string, định dạng: YYYYMMDDHHmm');
            }

            return thoi_gian + id + '-' + uuidv4()
        } catch (error) {
            throw error;
        }
    }
}